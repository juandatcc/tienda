import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartSidebarComponent } from '../../shared/ui/cart-sidebar/cart-sidebar.component';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, CartSidebarComponent],
  templateUrl: '../main-layout/main-layout.component.html',
  styleUrl: '../main-layout/main-layout.component.css',
})

// Componente que define el layout principal de la aplicación
export class MainLayoutComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router);

  // Señales para controlar estados del header
  showUserMenu = signal(false);
  showMobileMenu = signal(false);
  searchQuery = signal('');
  showSearchBar = signal(false);

  /**
   * Alterna la visibilidad del menú de usuario
   */
  toggleUserMenu(): void {
    this.showUserMenu.update((value) => !value);
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.authService.logout();
    this.showUserMenu.set(false);
    this.router.navigate(['/']);
  }

  /**
   * Abre la página de login
   */
  openLogin(): void {
    this.router.navigate(['/src/app/features/auth/login']);
  }

  /**
   * Cierra el menú de usuario cuando se navega
   */
  closeUserMenu(): void {
    this.showUserMenu.set(false);
  }

  /**
   * Alterna el menú móvil
   */
  toggleMobileMenu(): void {
    this.showMobileMenu.update((value) => !value);
  }

  /**
   * Cierra el menú móvil y navega
   */
  closeMobileMenu(): void {
    this.showMobileMenu.set(false);
  }

  /**
   * Alterna la barra de búsqueda
   */
  toggleSearchBar(): void {
    this.showSearchBar.update((value) => !value);
    if (!this.showSearchBar()) {
      this.searchQuery.set('');
    }
  }

  /**
   * Realiza la búsqueda de productos
   */
  performSearch(): void {
    const query = this.searchInput?.nativeElement?.value?.trim() || this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/src/app/features/product-list'], { queryParams: { search: query } });
      this.searchQuery.set('');
      this.showSearchBar.set(false);
    }
  }

  /**
   * Navega directamente a productos
   */
  goToProducts(): void {
    this.router.navigate(['/src/app/features/product-list']);
    this.closeMobileMenu();
  }

  /**
   * Navega directamente al inicio
   */
  goToHome(): void {
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  /**
   * Navega al carrito
   */
  goToCart(): void {
    this.router.navigate(['/cart']);
    this.closeMobileMenu();
  }
}
