# 🏗️ Arquitectura del Proyecto TechHub

## 📋 Índice
- [Visión General](#visión-general)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Patrones de Diseño](#patrones-de-diseño)
- [Flujo de Datos](#flujo-de-datos)
- [Convenciones de Código](#convenciones-de-código)

---

## 🎯 Visión General

TechHub es una aplicación e-commerce moderna construida con **Angular 18+** y arquitectura standalone components. La aplicación sigue principios de **Clean Architecture** y **Domain-Driven Design** para mantener el código organizado, escalable y mantenible.

### Tecnologías Principales
- **Angular 18+**: Framework principal con standalone components
- **TypeScript 5+**: Lenguaje de programación con tipado fuerte
- **Tailwind CSS 4**: Framework de estilos utility-first
- **RxJS**: Programación reactiva
- **Angular Signals**: Gestión de estado reactiva (nueva API)

---

## 📁 Estructura de Carpetas

```
src/app/
├── core/                          # Núcleo de la aplicación (singleton services)
│   ├── constants/                 # Constantes globales
│   │   └── app.constants.ts      # STORAGE_KEYS, TIMEOUTS, MESSAGES, ROUTES, etc.
│   ├── enums/                     # Enumeraciones
│   │   ├── notification-type.enum.ts  # Tipos de notificaciones
│   │   └── user-role.enum.ts      # Roles de usuario (ADMIN, CLIENT)
│   ├── guards/                    # Guards de rutas
│   │   ├── auth.guard.ts         # Protege rutas autenticadas
│   │   └── guest.guard.ts        # Redirige usuarios autenticados
│   ├── interceptors/              # Interceptors HTTP
│   │   └── auth.interceptor.ts   # Añade token JWT a peticiones
│   ├── models/                    # Interfaces y tipos
│   │   ├── backend.models.ts     # DTOs del backend
│   │   ├── cart.model.ts         # Cart, CartItem, CartSummary
│   │   ├── category.model.ts     # Category
│   │   ├── payment.model.ts      # Payment models (PSE)
│   │   ├── product.model.ts      # Product, ProductFormData
│   │   └── user.model.ts         # User, AuthResponse, LoginCredentials
│   ├── services/                  # Servicios singleton
│   │   ├── auth.service.ts       # Autenticación y sesión
│   │   ├── cart.service.ts       # Gestión del carrito
│   │   ├── category.service.ts   # CRUD categorías
│   │   ├── notification.service.ts # Sistema de notificaciones toast
│   │   ├── payment.service.ts    # Integración PSE
│   │   └── product.service.ts    # CRUD productos
│   └── types/                     # Tipos TypeScript reutilizables
│       └── common.types.ts       # ApiResponse, PaginatedResponse, etc.
│
├── features/                      # Módulos de funcionalidades
│   ├── admin/                     # Área de administración
│   │   ├── dashboard/            # Dashboard con estadísticas
│   │   ├── product-form/         # Crear/editar productos
│   │   └── product-list/         # Gestión de productos
│   ├── auth/                      # Autenticación
│   │   ├── login/                # Página de login
│   │   └── register/             # Página de registro
│   ├── cart/                      # Carrito de compras
│   ├── home/                      # Página principal
│   ├── product-detail/           # Detalle de producto
│   ├── product-list/             # Catálogo con filtros
│   └── profile/                   # Perfil de usuario
│
├── layouts/                       # Plantillas de layout
│   ├── auth-layout/              # Layout para páginas de auth
│   └── main-layout/              # Layout principal con header/footer
│
├── shared/                        # Componentes y utilidades compartidas
│   ├── components/                # Componentes reutilizables
│   │   ├── product-card/         # Card de producto
│   │   └── product-skeleton/     # Skeleton loader
│   ├── pipes/                     # Pipes personalizados
│   │   └── price-format.pipe.ts  # Formato de precios COP
│   └── ui/                        # Componentes de UI
│       ├── badge/                 # Badges de estado
│       ├── button/                # Botones reutilizables
│       ├── cart-sidebar/          # Panel lateral del carrito
│       └── toast/                 # Notificaciones toast
│
└── environments/                  # Configuración de entornos
    └── environment.ts            # Variables de entorno
```

---

## 🎨 Patrones de Diseño

### 1. **Standalone Components Architecture**
Todos los componentes son standalone, eliminando la necesidad de NgModules y mejorando el tree-shaking.

```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent { }
```

### 2. **Angular Signals (Estado Reactivo)**
Utilización de signals para gestión de estado local y global, reemplazando observables donde sea apropiado.

```typescript
// Signal simple
items = signal<CartItem[]>([]);

// Signal computado (reactivo)
total = computed(() => 
  this.items().reduce((acc, item) => acc + item.price * item.quantity, 0)
);

// Effect (side effect)
effect(() => {
  localStorage.setItem('cart', JSON.stringify(this.items()));
});
```

### 3. **Dependency Injection con inject()**
Uso de la función `inject()` en lugar del constructor tradicional para inyección de dependencias.

```typescript
export class ProductService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
}
```

### 4. **Separation of Concerns**
- **Core**: Lógica de negocio, servicios y modelos
- **Features**: Componentes de funcionalidades específicas
- **Shared**: Componentes reutilizables en toda la app
- **Layouts**: Estructuras de página

### 5. **Guard-Based Authorization**
Control de acceso basado en guards funcionales:

```typescript
// authGuard: Protege rutas autenticadas
{
  path: 'admin',
  canActivate: [authGuard],
  data: { role: 'ADMIN' }
}

// guestGuard: Evita acceso de usuarios autenticados
{
  path: 'auth',
  canActivate: [guestGuard]
}
```

### 6. **Service-Component Pattern**
Los componentes delegan la lógica de negocio a servicios:

```typescript
// Componente (presentación)
export class ProductListComponent {
  private productService = inject(ProductService);
  
  ngOnInit() {
    this.productService.getProducts().subscribe(...);
  }
}

// Servicio (lógica de negocio)
export class ProductService {
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
```

---

## 🔄 Flujo de Datos

### Flujo de Autenticación
```
Usuario → Login Component → AuthService → Backend API
                                ↓
                          localStorage (token)
                                ↓
                          currentUser signal
                                ↓
                    Actualización reactiva en toda la app
```

### Flujo del Carrito

#### Usuario No Autenticado
```
Añadir Producto → CartService → localStorage
                       ↓
                  items signal
                       ↓
              Actualización UI automática
```

#### Usuario Autenticado
```
Añadir Producto → CartService → ServerCartService → Backend API
                                        ↓
                                  Respuesta del servidor
                                        ↓
                                   items signal
                                        ↓
                              Sincronización local
```

### Flujo de Notificaciones
```
Acción (ej: añadir al carrito)
        ↓
NotificationService.success()
        ↓
notifications signal
        ↓
ToastComponent (subscrito al signal)
        ↓
Animación slide-in
        ↓
Auto-dismiss después de 3s
```

---

## 📝 Convenciones de Código

### Nomenclatura

#### Archivos
- **Componentes**: `product-card.component.ts`
- **Servicios**: `product.service.ts`
- **Guards**: `auth.guard.ts`
- **Interceptors**: `auth.interceptor.ts`
- **Pipes**: `price-format.pipe.ts`
- **Modelos**: `product.model.ts`

#### Clases e Interfaces
```typescript
// PascalCase para clases
export class ProductService { }

// PascalCase para interfaces
export interface Product { }

// PascalCase para enums
export enum UserRole { }

// SCREAMING_SNAKE_CASE para constantes
export const STORAGE_KEYS = {
  TOKEN: 'token',
  CART: 'cart'
} as const;
```

#### Variables y Métodos
```typescript
// camelCase para variables y métodos
currentUser = signal<User | null>(null);

// camelCase para métodos
login(credentials: LoginCredentials) { }
```

### Comentarios JSDoc

Todos los servicios, componentes y métodos públicos deben tener comentarios JSDoc en español:

```typescript
/**
 * Agrega un producto al carrito de compras
 * 
 * Comportamiento según el estado de autenticación:
 * - **Usuario autenticado**: Envía la petición al servidor y sincroniza
 * - **Usuario no autenticado**: Actualiza el carrito local en localStorage
 * 
 * @param product - Producto a agregar al carrito
 * 
 * @example
 * ```typescript
 * agregarProducto(producto: Product) {
 *   this.cartService.addToCart(producto);
 * }
 * ```
 */
addToCart(product: Product) { }
```

### Organización de Imports

```typescript
// 1. Imports de Angular
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Imports de terceros
import { Observable } from 'rxjs';

// 3. Imports de core
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';

// 4. Imports de features
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
```

### TypeScript Strict Mode

El proyecto tiene activado el modo estricto de TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

---

## 🔐 Seguridad

### Almacenamiento del Token
- Token JWT almacenado en `localStorage`
- Incluido automáticamente en todas las peticiones HTTP via `AuthInterceptor`
- Limpiado al cerrar sesión

### Control de Acceso
- `authGuard`: Verifica autenticación y roles
- `guestGuard`: Evita que usuarios autenticados accedan a login/register
- Validación adicional en el backend

### Validación de Stock
- Validación en el frontend antes de añadir al carrito
- Validación adicional en el backend para seguridad

---

## 🚀 Mejores Prácticas

### 1. **Signals First**
Preferir signals sobre observables para estado local:
```typescript
// ✅ Bien
count = signal(0);

// ❌ Evitar
count$ = new BehaviorSubject(0);
```

### 2. **Computed Signals para Derivaciones**
```typescript
// ✅ Bien
filteredProducts = computed(() => {
  return this.products().filter(p => p.stock > 0);
});
```

### 3. **Services para Lógica de Negocio**
```typescript
// ✅ Bien - en servicio
export class CartService {
  addToCart(product: Product) {
    // Lógica compleja aquí
  }
}

// ❌ Evitar - en componente
export class ProductCardComponent {
  addToCart() {
    // Lógica de negocio NO debe estar aquí
  }
}
```

### 4. **Tipos Fuertes**
```typescript
// ✅ Bien
function getUser(): User | null { }

// ❌ Evitar
function getUser(): any { }
```

### 5. **Manejo de Errores**
```typescript
// ✅ Bien
this.http.get<Product[]>(url).subscribe({
  next: (data) => this.products.set(data),
  error: (err) => {
    console.error('Error cargando productos', err);
    this.notificationService.error('Error al cargar productos');
  }
});
```

---

## 📚 Recursos Adicionales

- [Angular Documentation](https://angular.io/docs)
- [Angular Signals Guide](https://angular.io/guide/signals)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contribuciones

Para mantener la consistencia del código:
1. Seguir las convenciones de nomenclatura
2. Añadir comentarios JSDoc en español
3. Mantener la estructura de carpetas
4. Escribir tests para nueva funcionalidad
5. Actualizar esta documentación si cambia la arquitectura
