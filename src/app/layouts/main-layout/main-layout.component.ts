import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { CartSidebarComponent } from "../../shared/ui/cart-sidebar/cart-sidebar.component";
import { ToastComponent } from "../../shared/ui/toast/toast.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, CartSidebarComponent, ToastComponent, FormsModule],
  templateUrl: './main-layout.component.html',

})

// Componente que define el layout principal de la aplicación
export class MainLayoutComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // Señales para controlar estados del header
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);
  searchQuery = signal('');
  showSearchBar = signal(false);

  /**
   * Alterna la visibilidad del menú de usuario
   */
  showMobileMenu = this.mobileMenuOpen;
  showUserMenu = this.userMenuOpen;

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) { }

  /**
   * Cierra la sesión del usuario
   */
  logout() {
    this.closeUserMenu();
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  toggleUserMenu() {
    this.userMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  closeUserMenu() {
    this.userMenuOpen.set(false);
  }

  /**
   * Maneja la búsqueda de productos
   */
  onSearch() {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/products'], { queryParams: { busqueda: query } });
      this.closeMobileMenu();
    }
  }

  /**
   * Limpia la búsqueda
   */
  clearSearch() {
    this.searchQuery.set('');
    this.router.navigate(['/products']);
  }
}


