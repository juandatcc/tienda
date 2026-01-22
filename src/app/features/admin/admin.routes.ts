import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/new',
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'products/:id/edit',
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
  }
];
