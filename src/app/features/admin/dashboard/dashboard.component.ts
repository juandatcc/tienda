import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    private productService = inject(ProductService);
    private categoryService = inject(CategoryService);

    totalProducts = signal(0);
    totalCategories = signal(0);
    lowStockProducts = signal(0);
    recentProducts = signal<Product[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.productService.getProducts().subscribe({
            next: (products) => {
                this.totalProducts.set(products.length);
                this.lowStockProducts.set(products.filter(p => p.stock < 10).length);
                this.recentProducts.set(products.slice(0, 5));
                this.loading.set(false);
            }
        });

        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.totalCategories.set(categories.length);
            }
        });
    }
}
