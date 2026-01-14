import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    address: [''],
    adminCode: ['']
  });

  loading = signal(false);
  error = signal('');

  /**
   * Verifica si un campo del formulario es inválido y ha sido tocado.
   * @param field Nombre del campo
   */
  isInvalid(field: string) {
    const control = this.registerForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  /**
   * Maneja el envío del formulario de registro.
   * Crea el usuario y redirige al home si es exitoso.
   */
  onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.error.set('');
      
      const { fullName, email, password, phone, address, adminCode } = this.registerForm.value;
      
      const role = adminCode ? 'admin' : 'user';

      // Aquí típicamente validarías el código de administrador contra un backend o una constante
      // Por ahora, asumimos que cualquier código no vacío otorga acceso de administrador
      
      this.authService.register({ 
        fullName: fullName!, 
        email: email!, 
        password: password!,
        phone: phone || undefined,
        address: address || undefined,
        role
      }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set('Error al registrar usuario. Intente nuevamente.');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
