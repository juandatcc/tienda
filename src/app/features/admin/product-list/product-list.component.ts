import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

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
}
