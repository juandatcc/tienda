import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

/**
 * Formulario para crear o editar productos.
 * Maneja la validación y el envío de datos al servicio.
 */
@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html'
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

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * Inicializa el componente. Comprueba si es modo edición (ID en URL).
   */
  ngOnInit() {
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
    this.productService.getProduct(id).subscribe(product => {
      if (product) {
        this.productForm.patchValue(product);
      } else {
        this.router.navigate(['/admin/products']);
      }
    });
  }

  /**
   * Maneja el envío del formulario (Crear o Actualizar).
   */
  onSubmit() {
    if (this.productForm.invalid) return;

    this.isSubmitting.set(true);
    const product: Product = this.productForm.value;

    if (this.isEditing() && this.productId) {
      this.productService.updateProduct(this.productId, product).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error updating product', err);
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.productService.createProduct(product).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error creating product', err);
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
