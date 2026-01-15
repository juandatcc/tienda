# API Contract (resumen)

## Base URL

- http://localhost:8080/api

## Auth

- POST /auth/register -> RegisterRequest
- POST /auth/login -> LoginRequest
- POST /auth/logout -> (requiere Authorization Bearer token)

DTOs:

- LoginRequest: { correo: string, contrasena: string }
- RegisterRequest: { correo, contrasena, nombre, telefono, direccion?, codigoAdmin? }
- AuthResponse: { token, correo, rol }

## Productos

- GET /productos -> ProductoResponse[]
- GET /productos/{id} -> ProductoResponse
- POST /productos -> ProductoRequest
- PUT /productos/{id} -> ProductoRequest
- DELETE /productos/{id}

DTOs:

- ProductoResponse: { idProducto, nombre, descripcion, precio, stock, categoriaId, categoriaNombre }
- ProductoRequest: { nombre, descripcion?, precio, stock, categoriaId }

## Carrito

- POST /carrito/agregar -> AddToCarritoRequest
- GET /carrito -> CarritoResponse
- DELETE /carrito/eliminar/{productoId}
- PUT /carrito/actualizar -> { items: [{ productoId, cantidad }] }

DTOs:

- AddToCarritoRequest: { productoId, cantidad }
- CarritoResponse: { carritoId, items: CarritoItemResponse[] }
- CarritoItemResponse: { productoId, nombreProducto, descripcionProducto, cantidad, precio }

## Ventas

- POST /ventas/confirmar -> Cierra la venta (requiere token)

---

Notas:

- He creado interfaces TypeScript en `src/app/core/models/backend.models.ts` y un servicio `ServerCartService` para interactuar con los endpoints del carrito.
- También añadí un `AuthInterceptor` para inyectar el token en las peticiones salientes.
