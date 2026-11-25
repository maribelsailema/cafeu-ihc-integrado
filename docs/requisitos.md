# Requisitos y Arquitectura de Información - CaféU 2.0

## 1. Requisitos Funcionales (6)

| ID   | Descripción                                                                 |
|------|-----------------------------------------------------------------------------|
| RF01 | El sistema debe permitir consultar el catálogo de productos.                |
| RF02 | El sistema debe permitir buscar productos de forma tolerante a tildes y mayúsculas. |
| RF03 | El sistema debe permitir agregar productos al carrito indicando cantidad.   |
| RF04 | El sistema debe permitir modificar la cantidad de productos en el carrito.  |
| RF05 | El sistema debe permitir eliminar productos del carrito.                    |
| RF06 | El sistema debe permitir confirmar el pedido y mostrar un mensaje de confirmación. |

## 2. Requisitos No Funcionales (4)

| ID    | Descripción                                                              |
|-------|--------------------------------------------------------------------------|
| RNF01 | La interfaz debe ser responsive y seguir el enfoque Mobile First.        |
| RNF02 | La aplicación debe permitir navegación completa por teclado.             |
| RNF03 | Los mensajes de error y confirmación deben ser visibles y comprensibles. |
| RNF04 | El sistema debe persistir los datos del carrito (LocalStorage o API).    |

## 3. Sitemap

```text
CaféU 2.0 (Sitio Web)
└── Inicio / Catálogo
│   ├── Búsqueda de productos
│   └── Detalle de producto
└── Carrito
│   ├── Modificar cantidad
│   ├── Eliminar producto
│   └── Confirmar pedido
└── Confirmación
```

## 4. User Flow

### Flujo de compra
1. Usuario ingresa al catálogo
2. Busca o selecciona un producto
3. Indica cantidad
4. Agrega al carrito
5. Revisa carrito
6. Confirma pedido
7. Recibe mensaje de confirmación

### Flujo de modificación
1. Usuario ingresa al carrito
2. Selecciona producto
3. Modifica cantidad
4. Sistema actualiza total
5. Usuario continúa o confirma

### Flujo de cancelación / eliminación
1. Usuario ingresa al carrito
2. Selecciona opción de eliminar
3. Sistema solicita confirmación (o permite recuperar)
4. Producto se elimina
5. Sistema actualiza total

## 5. Matriz de trazabilidad

| Requisito | Pantalla / Componente      | Prueba asociada          |
|-----------|----------------------------|--------------------------|
| RF01      | Catálogo                   | T1                       |
| RF02      | Búsqueda                   | T1                       |
| RF03      | Catálogo / Carrito         | T1                       |
| RF04      | Carrito                    | T2                       |
| RF05      | Carrito                    | T3                       |
| RF06      | Confirmación               | T3                       |
| RNF01     | Todas las pantallas        | Prueba responsive        |
| RNF02     | Todas las pantallas        | Prueba de teclado        |
| RNF03     | Mensajes de sistema        | Evaluación heurística    |
| RNF04     | Carrito / Persistencia     | Prueba de persistencia   |