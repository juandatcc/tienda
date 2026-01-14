import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  error = signal('');

  /**
   * Verifica si el campo es inválido para mostrar errores visuales.
   * @param field Nombre del campo
   */
  isInvalid(field: string) {
    const control = this.loginForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  /**
   * Maneja el login del usuario.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set('');
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set('Credenciales incorrectas o error del servidor.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
