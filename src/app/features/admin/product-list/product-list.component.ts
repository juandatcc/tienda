import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { NotificationService } from '../../../core/services/notification.service';

/**
 * Componente administrativo para gestionar productos.
 * Muestra una tabla con productos y permite eliminarlos o navegar a edición.
 */
@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  products = signal<Product[]>([]);

  ngOnInit() {
    this.loadProducts();
  }

  /**
   * Carga la lista de productos desde el servicio.
   */
  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }

  /**
   * Elimina un producto tras confirmación.
   * @param id ID del producto
   */
  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  onEdit(productId: number) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      this.notificationService.error('Debes iniciar sesión como administrador');
      this.router.navigate(['/auth/login']);
      return;
    }

    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!user || user.rol !== 'ADMIN') {
        this.notificationService.error('Solo un administrador puede editar productos');
        this.router.navigate(['/']);
        return;
      }
    } catch (e) {
      console.warn('No se pudo leer el usuario del localStorage', e);
    }

    this.router.navigate(['/admin/products', productId, 'edit']);
  }
}
