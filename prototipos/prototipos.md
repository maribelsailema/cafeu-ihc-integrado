# Prototipos de CaféU 2.0

## 1. Propósito

Este directorio contiene los prototipos de baja fidelidad/alta definición visual elaborados en Figma para representar la experiencia móvil de CaféU 2.0. Los diseños sirven como referencia para implementar y validar los flujos principales de navegación y pedido.

Los prototipos documentan tanto el flujo principal de compra como estados alternativos que pueden afectar la experiencia de uso.

## 2. Alcance

El prototipo contempla las siguientes pantallas:

1. **Inicio:** bienvenida, acceso al buscador y acceso destacado al menú.
2. **Menú:** listado de productos, categorías y acceso al detalle.
3. **Detalle del producto:** información del producto, precio, selección de cantidad e indicaciones especiales.
4. **Mi pedido:** productos agregados, controles de cantidad, resumen y total.
5. **Estado del pedido:** información del pedido y su estado de preparación.
6. **Modal de alerta:** confirmación antes de cancelar un pedido.
7. **Confirmación:** resultado de la recepción del pedido y resumen de compra.
8. **Carrito vacío:** mensaje informativo y acción para volver al menú.
9. **Búsqueda sin resultados:** mensaje para una consulta que no encuentra productos.
10. **Sin conexión:** aviso de falta de conectividad y acción para reintentar.

## 3. Archivos del prototipo

| Archivo | Descripción |
| :--- | :--- |
| `flujo-principal.png` | Vista general del flujo conectado entre pantallas. |
| `catalogo.png` | Inicio, menú y detalle del producto. |
| `carrito.png` | Mi pedido, estado del pedido y modal de alerta. |
| `confirmacion.png` | Confirmación del pedido. |
| `estados-y-errores.md` | Descripción de estados alternativos, errores y recuperación. |

> **Nota:** Los nombres anteriores describen los archivos que deben exportarse desde Figma. Se deben conservar los nombres al incorporarlos al repositorio.

## 4. Flujo principal

El recorrido esperado del usuario es:

1. Ingresar a la pantalla de inicio.
2. Abrir el menú.
3. Explorar los productos o utilizar la búsqueda.
4. Seleccionar un producto.
5. Consultar su detalle y agregarlo al pedido.
6. Revisar los productos y cantidades en «Mi pedido».
7. Confirmar el pedido.
8. Visualizar la pantalla de confirmación y el identificador del pedido.

El usuario también puede regresar a pantallas anteriores para modificar su selección antes de confirmar.

## 5. Criterios de diseño considerados

* Priorizar el uso desde dispositivos móviles.
* Mantener una navegación comprensible y consistente.
* Mostrar precios, cantidades y total de forma legible.
* Diferenciar las acciones principales de las secundarias.
* Informar al usuario cuando una operación no produce resultados o no puede completarse.
* Ofrecer una acción de recuperación cuando sea posible.
* Evitar que una acción destructiva, como cancelar un pedido, se ejecute sin confirmación.

## 6. Relación con la implementación

Los prototipos son una referencia visual y funcional. Antes de considerar una pantalla implementada, se debe comparar el prototipo con la versión ejecutable y registrar las diferencias relevantes.

No se debe asumir que una interacción está implementada únicamente porque aparece representada en Figma. La implementación debe comprobarse en la aplicación.

## 7. Fuente editable

* **Enlace al archivo de Figma:** [https://www.figma.com/proto/mmnzX5MbN4kv4IhYOqlQR8/cafeU_prototipo?node-id=3-1958&p=f&t=HGNc27lHh10cTcEf-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3%3A1958](https://www.figma.com/proto/mmnzX5MbN4kv4IhYOqlQR8/cafeU_prototipo?node-id=3-1958&p=f&t=HGNc27lHh10cTcEf-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3%3A1958)