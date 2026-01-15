import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm: FormGroup;
  isEditing = signal(false);
  isSubmitting = signal(false);
  productId: number | null = null;

  categories = signal<CategoriaAdminResponse[]>([]);
  imagePreview = signal<string | null>(null);

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
    // Cargar categorías
    const categoryService = inject(CategoryService);
    categoryService.getCategories().subscribe((list) => this.categories.set(list));

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
      if (product) {
        // Mapear campos hacia el formulario
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
        this.router.navigate(['/admin/products']);
      }
    });
  }

  /**
   * Maneja el envío del formulario (Crear o Actualizar).
   */
  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
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

    if (this.isEditing() && this.productId) {
      this.productService.updateProduct(this.productId, productToSend).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error updating product', err);
          this.isSubmitting.set(false);
        },
      });
    } else {
      this.productService.createProduct(productToSend).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error creating product', err);
          this.isSubmitting.set(false);
        },
      });
    }
  }

  onImageUrlChange(value: string) {
    this.imagePreview.set(value || null);
  }
}
