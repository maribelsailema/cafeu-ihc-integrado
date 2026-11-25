# User Flows — CaféU 2.0 (Compra, Modificación y Cancelación/Recuperación)

## 1. Flujo de Compra Completa (T1 + T3)

```mermaid
flowchart LR
    A["Inicio: Catálogo"] --> B["Escribir búsqueda (ej. 'cafe' sin tilde) o elegir categoría"]
    B --> C{"¿Hay resultados?"}
    C -->|No| D["Estado vacío + Botón 'Ver todo el catálogo'"]
    D --> B
    C -->|Sí| E["Pulsar '+ Agregar' en tarjeta"]
    E --> F["Toast confirmación + Badge actualizado + Persiste en localStorage"]
    F --> G["Revisar Carrito e ingresar Nombre para retiro"]
    G --> H{"¿Nombre válido >= 2 chars?"}
    H -->|No| I["Error inline (role='alert') + foco en campo"]
    I --> G
    H -->|Sí| J["Pulsar 'Confirmar pedido'"]
    J --> K["Modal accesible con código CU-XXXX + Guarda en Historial + Limpia carrito"]
```

## 2. Flujo de Modificación de Cantidades (T2)

```mermaid
flowchart LR
    M1["Ítem en Carrito"] --> M2["Pulsar '+' o '−' (44×44 px)"]
    M2 --> M3{"¿Cantidad en rango 1..20?"}
    M3 -->|No| M4["Botón deshabilitado o DomainError visible"]
    M3 -->|Sí| M5["Recalcula subtotal, total y tiempo estimado + Persiste en localStorage"]
```

## 3. Flujo de Eliminación, Recuperación (Deshacer) y Cancelación (T3)

```mermaid
flowchart LR
    E1["Ítem en Carrito"] --> E2["Pulsar 'Eliminar'"]
    E2 --> E3["Quita ítem y guarda copia en undoStack"]
    E3 --> E4["Muestra Banner + Toast con botón 'Deshacer'"]
    E4 --> E5{"¿Usuario pulsa 'Deshacer'?"}
    E5 -->|Sí| E6["Restaura ítem con cantidad y posición original"]
    E5 -->|No| E7["Permanece eliminado; opción 'Vaciar' cancela todo el pedido"]
```
