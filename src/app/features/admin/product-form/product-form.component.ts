import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product.model';
import { CategoryService } from '../../../core/services/category.service';
import { CategoriaAdminResponse } from '../../../core/models/backend.models';

/**
 * Formulario para crear o editar productos.
 * Maneja la validación y el envío de datos al servicio.
 */
@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm: FormGroup;
  isEditing = signal(false);
  isSubmitting = signal(false);
  productId: number | null = null;

  categories = signal<CategoriaAdminResponse[]>([]);
  imagePreview = signal<string | null>(null);
  selectedFile?: File;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      categoryId: [null, Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  /**
   * Inicializa el componente. Comprueba si es modo edición (ID en URL).
   */
  ngOnInit() {
    // Cargar categorías desde backend
    this.categoryService.getCategories().subscribe({
      next: (list) => {
        this.categories.set(list);
        console.log('Categorías cargadas:', list);
        if (!list.length) {
          this.notificationService.info('No hay categorías disponibles, crea una primero');
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.notificationService.error('No se pudieron cargar las categorías');
      }
    });

    // Log de usuario actual para depuración
    try {
      const user = localStorage.getItem('user');
      console.log('Usuario en localStorage:', user ? JSON.parse(user) : null);
    } catch (e) {
      console.warn('No se pudo leer el usuario del localStorage', e);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  /**
   * Carga los datos de un producto para edición.
   * @param id ID del producto
   */
  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe((product) => {
      console.log('Respuesta de getProduct:', product);
      if (product) {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl ?? '',
          categoryId: product.categoryId ?? null,
          stock: product.stock,
        });
        if (product.imageUrl) this.imagePreview.set(product.imageUrl);
      } else {
        console.warn('Producto no encontrado, redirigiendo a /admin/products');
        this.notificationService.error('No se pudo cargar el producto');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  /**
   * Maneja el envío del formulario (Crear o Actualizar).
   */
  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      this.notificationService.error('Debes iniciar sesión como administrador para guardar');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isSubmitting.set(true);
    const form = this.productForm.value;

    const productToSend: Product = {
      id: this.productId ?? 0,
      name: form.name,
      description: form.description,
      price: form.price,
      imageUrl: form.imageUrl,
      category: this.categories().find((c) => c.idCategoria === form.categoryId)?.nombre ?? '',
      categoryId: form.categoryId,
      stock: form.stock,
    };

    try {
      // Crear producto con archivo
      if (!this.isEditing() && this.selectedFile) {
        await firstValueFrom(this.productService.createProductWithImage(productToSend, this.selectedFile));
        this.notificationService.success('Producto creado correctamente');
        this.router.navigate(['/admin/products']);
        return;
      }

      // Actualizar imagen si se adjunta en modo edición
      if (this.isEditing() && this.productId && this.selectedFile) {
        const updatedWithImage = await firstValueFrom(
          this.productService.uploadProductImage(this.productId, this.selectedFile)
        );
        productToSend.imageUrl = updatedWithImage.imageUrl;
      }

      // Crear o actualizar sin archivo (o después de subirlo)
      if (this.isEditing() && this.productId) {
        await firstValueFrom(this.productService.updateProduct(this.productId, productToSend));
        this.notificationService.success('Producto actualizado correctamente');
      } else {
        await firstValueFrom(this.productService.createProduct(productToSend));
        this.notificationService.success('Producto creado correctamente');
      }

      this.router.navigate(['/admin/products']);
    } catch (err: any) {
      if (err?.status === 401 || err?.status === 403) {
        this.notificationService.error('No tienes permisos para esta acción, inicia sesión como admin');
        this.router.navigate(['/auth/login']);
      } else {
        this.notificationService.error('Ocurrió un error al guardar el producto');
      }
      console.error('Error guardando producto', err);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onImageFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      this.selectedFile = undefined;
      return;
    }
    this.selectedFile = file;
    this.imagePreview.set(URL.createObjectURL(file));
  }

  onImageUrlChange(value: string) {
    this.imagePreview.set(value || null);
    if (value) this.selectedFile = undefined;
  }
}
