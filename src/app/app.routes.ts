import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    // Layout principal con rutas hijas
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      // Rutas hijas del layout principal
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      // Ruta para la lista de productos
      {
        path: 'products',
        loadComponent: () => import('./features/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      // Ruta para el detalle de un producto
      {
        path: 'products/:id',
        loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      // Ruta para el carrito de compras
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
      },
      // Rutas para pagos PSE
      {
        path: 'pago/iniciar',
        loadComponent: () => import('./features/payments/pse-start/pse-start.component').then(m => m.PseStartComponent)
      },
      {
        path: 'pago/resultado',
        loadComponent: () => import('./features/payments/pse-return/pse-return.component').then(m => m.PseReturnComponent)
      },
      // Ruta para el perfil de usuario
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
      }
    ]
  },

  // Layout de autenticación con rutas hijas
  {
    // Ruta para autenticación
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      // Rutas hijas del layout de autenticación
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      // Ruta para registro de usuarios
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      // Redirección por defecto a login
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  // Rutas para el área de administración, protegidas por authGuard
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard]
  },
  // Redirección para rutas no encontradas
  { path: '**', redirectTo: '' }
];
