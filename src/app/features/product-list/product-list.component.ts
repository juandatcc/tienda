import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CategoryService } from '../../core/services/category.service';
import { CategoriaAdminResponse } from '../../core/models/backend.models';

/**
 * Componente que muestra una lista grid de todos los productos disponibles.
 * Incluye un estado de carga (skeleton) y estado vacío.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  products = signal<Product[]>([]);
  loading = signal(true);
  categories = signal<CategoriaAdminResponse[]>([]);
  selectedCategory = signal<number | null>(null);
  errorMessage = signal<string | null>(null);

  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    if (!cat) return this.products();
    return this.products().filter((p) => p.categoryId === cat);
  });

  /** Carga los productos al inicializar el componente */
  ngOnInit() {
    this.categoryService.getCategories().subscribe((list) => this.categories.set(list));

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
        if (data.length === 0) {
          this.errorMessage.set('No hay productos disponibles o no se pudo conectar con el servidor.');
        }
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading.set(false);
        this.errorMessage.set('Error al conectar con el servidor. Por favor, verifica que el backend esté funcionando en http://localhost:8080');
      }
    });

    // Leer el parámetro de categoría de la URL
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(Number(params['category']));
      }
    });
  }

  onCategoryChange(val: string) {
    this.selectedCategory.set(val ? Number(val) : null);
  }
}
