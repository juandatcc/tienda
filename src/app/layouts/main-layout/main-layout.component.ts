import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { CartSidebarComponent } from "../../shared/ui/cart-sidebar/cart-sidebar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CartSidebarComponent],
  templateUrl: './main-layout.component.html'
})
export class LayoutComponent {
  toggleCart() {
    throw new Error('Method not implemented.');
  }
  goLogin() {
    throw new Error('Method not implemented.');
  }
  goCart() {
    throw new Error('Method not implemented.');
  }
  goProducts() {
    throw new Error('Method not implemented.');
  }
  goHome() {
    throw new Error('Method not implemented.');
  }
  logout() {
    throw new Error('Method not implemented.');
  }
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  showMobileMenu = this.mobileMenuOpen;
  showUserMenu = this.userMenuOpen;

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) { }

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
}


