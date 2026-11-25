# Arquitectura de CaféU 2.0

## 1. Decisión arquitectónica

CaféU 2.0 utiliza una arquitectura en capas con dependencias dirigidas hacia el dominio. La primera entrega usa TypeScript, Vite y persistencia local mediante `localStorage`. No requiere servidor ni base de datos externa.

```text
Presentación (src/presentation)
        |
        v
Aplicación (src/application)
        |
        v
Dominio (src/domain)
        ^
        |
Infraestructura (src/infrastructure)
  implementa puertos definidos por Aplicación
```

La presentación invoca casos de uso; la aplicación coordina el flujo y depende de contratos; el dominio concentra reglas e invariantes; infraestructura implementa repositorios y detalles técnicos.

## 2. Capas y responsabilidades

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Presentación | `src/presentation/` | Renderizar Inicio, Menú, Detalle, Mi Pedido, Estado y Confirmación; capturar acciones y mostrar mensajes. No calcula reglas de negocio. |
| Aplicación | `src/application/` | Orquestar buscar, agregar, cambiar cantidad, eliminar, deshacer, confirmar y cancelar. Define puertos de repositorio. |
| Dominio | `src/domain/` | Entidades `Producto`, `DetallePedido`, `Pedido`; cantidades, subtotales, total, estados y búsqueda normalizada. No depende del navegador. |
| Infraestructura | `src/infrastructure/` | Catálogo local y adaptador de persistencia `localStorage`; convierte entidades a DTO y viceversa. |

## 3. Dependencias

- `presentation -> application`: la interfaz conoce `PedidoUseCases`.
- `application -> domain`: los casos de uso usan entidades y servicio de búsqueda.
- `application -> ports`: la aplicación define `ProductoRepository` y `PedidoRepository`.
- `infrastructure -> application ports + domain`: implementa los contratos y reconstruye entidades.
- `domain -> ninguna capa externa`: no importa DOM, localStorage, Vite ni componentes de interfaz.

La infraestructura se conecta mediante inyección de dependencias en `presentation/main.ts`. Esto permite reemplazar `LocalStoragePedidoRepository` por un adaptador HTTP sin modificar las reglas del dominio.

## 4. Modelo de dominio

### Producto
Identificador, nombre, descripción, precio, categoría, representación e indicador de personalización. El precio debe ser finito y no negativo.

### DetallePedido
Asocia un producto con cantidad e instrucciones. La cantidad es un entero entre 1 y 99. El subtotal es `precio * cantidad`, redondeado a dos decimales.

### Pedido
Contiene identificador, fecha, detalles y estado (`BORRADOR`, `CONFIRMADO`, `CANCELADO`). Solo un pedido en borrador se puede modificar. No se puede confirmar vacío. Los productos iguales con idénticas instrucciones se agrupan.

## 5. Persistencia

`LocalStoragePedidoRepository` guarda el borrador y los pedidos confirmados como DTO JSON bajo la clave `cafeu.pedido.v2`. El adaptador reconstruye entidades al leer, por lo que las validaciones vuelven a ejecutarse. Si el JSON está corrupto o no cumple el modelo, se limpia la entrada inválida y se informa el error.

Alcance actual:
- persistencia en el navegador y origen donde se ejecuta la aplicación;
- no sincroniza entre dispositivos;
- no existe autenticación, pago en línea, backend ni concurrencia multiusuario;
- el catálogo es local y de demostración.

## 6. Estados y flujos

- Crear: se crea un borrador al agregar el primer producto.
- Modificar: cantidad e instrucciones se validan en dominio.
- Eliminar: elimina el detalle y permite restaurarlo durante cinco segundos desde la presentación.
- Confirmar: exige al menos un detalle y cambia a `CONFIRMADO`; la interfaz informa primero «Pedido recibido» y después presenta comprobante.
- Cancelar: el dominio soporta transición a `CANCELADO`; la UI debe pedir confirmación. La cancelación de un pedido confirmado cambia su estado a `CANCELADO`; es local y no anula una orden de cocina real.

## 7. Búsqueda

`normalizarTexto` aplica Unicode NFD, elimina marcas diacríticas y convierte a minúsculas. Por ello, «cafe», «CAFÉ» y «Café» encuentran el mismo producto. La búsqueda se realiza sobre nombre, descripción y categoría.

## 8. Manejo de errores

Los casos de uso propagan errores de validación y persistencia. La presentación los captura y muestra mensajes comprensibles. La confirmación solo navega a estado de pedido después de que `guardar` finaliza correctamente; si falla, el carrito permanece disponible en el almacenamiento cuando el adaptador no pudo completar la escritura.

## 9. Justificación de separación

- Facilita probar reglas sin navegador.
- Evita que los componentes visuales manipulen directamente `localStorage`.
- Permite sustituir catálogo y persistencia sin reescribir casos de uso.
- Reduce duplicación de validaciones y mantiene totales consistentes.
- Hace explícitas las limitaciones de la versión local.

## 10. Decisiones y límites

La evidencia del prototipo Figma representa Inicio, Menú, Detalle, Mi Pedido, Estado, modal de cancelación y Confirmación. Los registros APE6 señalan que el buscador, botones Añadir/Eliminar, steppers, estado vacío y destinos del modal no quedan demostrados por la captura estática. En esta implementación se cablean las acciones principales como comportamiento funcional, pero esto no sustituye una nueva evaluación con usuarios ni confirma que el prototipo Figma original ya las tuviera conectadas.
