import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductSkeletonComponent } from '../../shared/components/product-skeleton/product-skeleton.component';
import { CategoryService } from '../../core/services/category.service';
import { CategoriaAdminResponse } from '../../core/models/backend.models';

/**
 * Componente de Listado de Productos con Filtros Avanzados
 * 
 * Este componente muestra el catálogo completo de productos en formato grid
 * con capacidades avanzadas de filtrado y ordenamiento.
 * 
 * Características principales:
 * - **Filtrado por categoría**: Permite filtrar productos por categoría desde la URL o selector
 * - **Búsqueda por texto**: Busca en nombre y descripción de productos
 * - **Ordenamiento**: Por nombre o precio, ascendente o descendente
 * - **Filtro de stock**: Opción para mostrar solo productos disponibles
 * - **Rango de precios**: Filtrado por rango de precios (preparado para UI)
 * - **Estado de carga**: Muestra skeletons mientras carga los datos
 * - **Responsive**: Grid adaptable a diferentes tamaños de pantalla
 * 
 * El filtrado es reactivo mediante computed signals, lo que significa
 * que cualquier cambio en los filtros actualiza automáticamente la lista.
 * 
 * @example
 * ```html
 * <!-- Navegación desde el home con categoría -->
 * <a [routerLink]="['/products']" [queryParams]="{categoria: 1}">
 *   Ver Routers
 * </a>
 * 
 * <!-- Navegación con búsqueda -->
 * <a [routerLink]="['/products']" [queryParams]="{busqueda: 'wifi'}">
 *   Buscar WiFi
 * </a>
 * ```
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductSkeletonComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  // ============================================
  // DEPENDENCIES (Dependencias Inyectadas)
  // ============================================

  /** Servicio para obtener productos del backend */
  private productService = inject(ProductService);

  /** Servicio para obtener categorías */
  private categoryService = inject(CategoryService);

  /** Ruta activa para leer query parameters */
  private route = inject(ActivatedRoute);

  // ============================================
  // SIGNALS (Estado Reactivo)
  // ============================================

  /** Array de todos los productos cargados del servidor */
  products = signal<Product[]>([]);

  /** Indica si los productos están cargando */
  loading = signal(true);

  /** Array de categorías disponibles */
  categories = signal<CategoriaAdminResponse[]>([]);

  /** ID de la categoría seleccionada (null = todas) */
  selectedCategory = signal<number | null>(null);

  /** Término de búsqueda ingresado por el usuario */
  searchQuery = signal<string>('');

  /** Opción de ordenamiento seleccionada */
  sortBy = signal<string>('name-asc');

  /** Rango de precios para filtrar (preparado para slider) */
  priceRange = signal<{ min: number; max: number }>({ min: 0, max: 10000000 });

  /** Mostrar solo productos con stock disponible */
  showOnlyInStock = signal<boolean>(false);

  /** Mensaje de error si falla la carga */
  errorMessage = signal<string | null>(null);

  /**
   * Productos filtrados y ordenados
   * 
   * Este computed signal se recalcula automáticamente cuando cambia
   * cualquier filtro (categoría, búsqueda, precio, stock, ordenamiento).
   * 
   * Proceso de filtrado:
   * 1. Inicia con todos los productos
   * 2. Aplica filtro de categoría
   * 3. Aplica filtro de búsqueda (nombre y descripción)
   * 4. Aplica filtro de rango de precios
   * 5. Aplica filtro de stock disponible
   * 6. Aplica ordenamiento seleccionado
   * 
   * @returns Array de productos después de aplicar todos los filtros
   */
  filteredProducts = computed(() => {
    let filtered = this.products();

    // Filtrar por categoría
    const cat = this.selectedCategory();
    if (cat) {
      filtered = filtered.filter((p) => p.categoryId === cat);
    }

    // Filtrar por búsqueda
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description?.toLowerCase() || '').includes(query)
      );
    }

    // Filtrar por rango de precios
    const range = this.priceRange();
    filtered = filtered.filter((p) => p.price >= range.min && p.price <= range.max);

    // Filtrar solo disponibles
    if (this.showOnlyInStock()) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Ordenar
    const sort = this.sortBy();
    if (sort === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  });

  /** Carga los productos al inicializar el componente */
  ngOnInit() {
    this.categoryService.getCategories().subscribe((list) => {
      this.categories.set(list);

      // Leer parámetros de la URL
      this.route.queryParams.subscribe(params => {
        // Categoría
        if (params['categoria']) {
          const categoryName = params['categoria'].toUpperCase();
          const category = list.find(c => c.nombre.toUpperCase() === categoryName);
          if (category) {
            this.selectedCategory.set(category.idCategoria);
          }
        } else if (params['category']) {
          this.selectedCategory.set(Number(params['category']));
        }

        // Búsqueda
        if (params['busqueda']) {
          this.searchQuery.set(params['busqueda']);
        }
      });
    });

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
  }

  onCategoryChange(val: string) {
    this.selectedCategory.set(val ? Number(val) : null);
  }

  onSortChange(val: string) {
    this.sortBy.set(val);
  }

  onStockFilterChange(checked: boolean) {
    this.showOnlyInStock.set(checked);
  }

  clearFilters() {
    this.selectedCategory.set(null);
    this.searchQuery.set('');
    this.sortBy.set('name-asc');
    this.priceRange.set({ min: 0, max: 10000000 });
    this.showOnlyInStock.set(false);
  }
}
