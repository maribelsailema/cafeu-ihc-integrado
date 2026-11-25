# Recorrido Cognitivo (Cognitive Walkthrough) — Tareas T2 y T3



---

## Tarea T2: Modificar cantidad y verificar total
- **Consigna:** *"Modifica la cantidad del producto que tienes en el carrito a 3 y verifica que el total se actualice."*
- **Estado inicial:** Pantalla `Mi Pedido` (`pantalla === "pedido"`) con al menos un producto agregado (ej. *Café americano*, cantidad `2`, subtotal `$3.00`).

| Paso | Acción esperada en CaféU 2.0 (`main.ts`) | Q1 | Q2 | Q3 | Q4 | Análisis y hallazgos sobre la interfaz real |
| :---: | :--- | :-: | :-: | :-: | :-: | :--- |
| 1 | Abrir el carrito desde el ícono superior `🛒` (`button.cart-top`), la barra flotante `Ver mi pedido →` o la barra inferior `Mi pedido`. | Sí | Sí | Sí | Sí | Existen tres accesos consistentes con contador numérico (`#header-count` y barra flotante), facilitando localizar el pedido tanto en móvil como en escritorio. |
| 2 | Localizar el producto en `Mi Pedido` y pulsar el botón `+` del control `.stepper.compact` (`aria-label="Aumentar cantidad"`) para cambiar la cantidad de `2` a `3`. | Sí | Sí | Sí | Sí | El stepper `− / 2 / +` es reconocible y el botón `Eliminar` está separado a la derecha. Sin embargo, si el usuario pulsa `−` cuando la cantidad es `1`, el producto se elimina directamente (`if (q < 1) { await eliminar(i); }`) sin aviso previo, lo que puede sorprender al usuario si solo esperaba que se detuviera en `1`. |
| 3 | Verificar el subtotal del ítem (`$4.50`) y el bloque `Resumen` (`Subtotal` / `Total` y botón `Confirmar pedido · $4.50`). | Sí | Sí | Sí | Sí | El recálculo es inmediato mediante `render()` y se refleja en tres lugares coherentes (subtotal de la fila, `Resumen` y el CTA `Confirmar pedido`), brindando alta confianza. |

---

## Tarea T3: Eliminar / recuperar y confirmar pedido
- **Consigna:** *"Elimina un producto del carrito. Si es posible, recupéralo. Luego confirma el pedido."*
- **Estado inicial:** Pantalla `Mi Pedido` (`pantalla === "pedido"`) con al menos un producto en la lista.

| Paso | Acción esperada en CaféU 2.0 (`main.ts`) | Q1 | Q2 | Q3 | Q4 | Análisis y hallazgos sobre la interfaz real |
| :---: | :--- | :-: | :-: | :-: | :-: | :--- |
| 1 | Pulsar el botón `Eliminar` (`button.delete[data-delete]`) del producto en `Mi Pedido`. | Sí | Sí | Sí | Sí | El botón tiene etiqueta explícita `Eliminar` y remueve el ítem inmediatamente mostrando el toast `Producto eliminado.` junto al botón `Deshacer`. |
| 2 | Recuperar el producto eliminado pulsando el botón `Deshacer` dentro del toast (`.toast button.undo`). | Sí | **Parcial** | Sí | Sí | **Hallazgo RC-01 (Severidad 2):** El toast permanece visible solo **5 segundos** (`toastTimer = window.setTimeout(..., 5000)`). Si el usuario lee el estado vacío `Tu pedido está vacío` o se distrae brevemente, el toast desaparece y pierde la posibilidad de recuperar el producto sin volver al menú.<br>**Hallazgo RC-02 (Accesibilidad):** El contenedor `.toast` se inyecta dinámicamente sin atributo `role="status"` ni `aria-live="polite"`, por lo que lectores de pantalla podrían no anunciar la opción `Deshacer`. |
| 3 | Verificar que el producto reapareció en `Mi Pedido` (`toast("Producto restaurado.")`) y pulsar `Confirmar pedido · $X.XX` (`#confirm`). | Sí | Sí | Sí | Sí | Al pulsar `Deshacer`, `casos.deshacerEliminacion()` restaura el ítem con sus instrucciones y cantidad originales y reaparece el botón principal `Confirmar pedido`. |
| 4 | Verificar la pantalla de confirmación (`pantalla === "estado"` → `¡Recibimos tu pedido!`, código `CU-...`, `En preparación`, `5–10 minutos`) y opcionalmente abrir `Ver comprobante` (`pantalla === "confirmacion"`). | Sí | Sí | Sí | Sí | **Hallazgo RC-03 (Severidad 1):** Existen dos vistas muy similares tras confirmar (`estado` con `Pedido recibido` y `confirmacion` con `¡Pedido recibido!` al pulsar `Ver comprobante`), lo cual cumple la visibilidad del código `CU-...`, aunque algunos usuarios pueden dudar si es obligatorio pulsar `Ver comprobante` para finalizar. |

---

## Síntesis de Hallazgos del Recorrido Cognitivo

| ID | Tarea | Severidad (0–4) | Hallazgo detectado en `src/presentation/main.ts` | Recomendación de mejora |
| :--- | :---: | :---: | :--- | :--- |
| **RC-01** | T3 | **2 (Menor)** | La opción `Deshacer` desaparece a los **5 segundos**, margen breve si el carrito queda vacío y el usuario está leyendo la pantalla. | Ampliar el tiempo a `7–8 segundos` o mostrar un botón persistente *Deshacer* dentro del estado vacío hasta que el usuario navegue. |
| **RC-02** | T3 | **2 (Menor)** | El elemento `.toast` carece de `role="status"` / `aria-live="polite"`, reduciendo visibilidad para usuarios de tecnologías asistivas. | Añadir `el.setAttribute("role", error ? "alert" : "status")` y `aria-live` al crear el toast. |
| **RC-03** | T3 | **1 (Cosmético)** | Redundancia leve entre la pantalla `estado` (*Pedido recibido*) y `confirmacion` (*Ver comprobante*). | Indicar explícitamente que el pedido ya está confirmado y que *Ver comprobante* es opcional para mostrar en caja. |
| **RC-04** | T2 | **1 (Cosmético)** | Pulsar `−` cuando la cantidad es `1` elimina el producto automáticamente en lugar de exigir el botón `Eliminar`. | Deshabilitar `−` en cantidad `1` o mantener el toast `Deshacer` con mayor duración para evitar sorpresas. |
