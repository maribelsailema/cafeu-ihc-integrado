# Validación técnica V2 – CaféU

**Estado:** registro de implementación y pruebas técnicas iniciales.  
**Importante:** no representa una nueva evaluación de usabilidad con participantes.

## 1. Base de priorización

Los hallazgos H-01 a H-05 fueron triangulados; H-06 a H-12 son de inspección heurística y varios requieren verificar versión o comportamiento. Por ello, esta implementación no afirma que todos los hallazgos condicionales fueran defectos demostrados.

## 2. Cambios técnicos incorporados

| Criterio | Cambio en CaféU 2.0 | Estado técnico |
|---|---|---|
| C-01 / H-01 | Acceso al pedido en cabecera con contador y barra inferior conservada | Implementado |
| C-02 / H-02 | Actualización inmediata del contador y total; notificación al agregar | Implementado |
| C-03 / H-03 | Control táctil de eliminar de al menos 44 px; opción Deshacer por 5 s; se conserva detalle eliminado | Implementado |
| C-04 / H-04 | «Ver opciones» separado de «Añadir»; marca Personalizable; instrucciones en detalle | Implementado |
| C-05 / H-05 | CTA «Ver Menú» prominente; buscador de Inicio deriva al catálogo al pulsar Enter; búsqueda funcional en Menú | Implementado |
| C-06 / H-06 | Estado vacío, CTA Explorar menú y ausencia del botón Confirmar | Implementado como prevención |
| C-07 / H-07 | Mensaje Pedido recibido antes de En preparación; se elimina porcentaje ficticio | Implementado en flujo local |
| C-08 / H-08 | Uso uniforme de «Total a pagar» y «Pago en caja» | Implementado |
| C-09 / H-09 | Errores de validación y recuperación con mensaje; no se navega a confirmación si guardar falla | Implementado parcialmente; sin simulador de caída de red/backend |
| C-10 / H-10 | Uso consistente de marca y escritura «Sánduches» | Implementado |
| C-11 / H-11 | Modal de cancelación con Volver al pedido y Sí, cancelar; conserva el pedido al desistir y registra estado CANCELADO al confirmar | Implementado en demostración local; falta validación interactiva de usabilidad |
| C-12 / H-12 | Se muestra estimado de 5–10 minutos en estado y comprobante | Implementado como estimación fija de demostración |

## 3. Pruebas técnicas incluidas

`tests/domain.test.ts` comprueba:
- cálculo de subtotales y total;
- rechazo de cantidades inválidas;
- agrupación de productos equivalentes;
- prohibición de confirmar un pedido vacío;
- bloqueo de edición después de confirmar;
- búsqueda sin tildes ni diferencias de mayúsculas.

`tests/use-cases.test.ts` comprueba:
- agregar, modificar, eliminar y restaurar;
- confirmación y bloqueo posterior;
- rechazo de identificadores de producto inexistentes.

Ejecutar con `npm test`.


## 4. Limitaciones pendientes

1. La persistencia es local al navegador; no representa una orden real recibida por la cafetería.
2. El código de pedido se genera localmente y no garantiza unicidad entre dispositivos.
3. No existe integración con caja, inventario, cocina, usuarios ni notificaciones.
4. El flujo de cancelación requiere definición operativa con la cafetería antes de exponerlo como acción real.
5. Los cinco a diez minutos son un texto de referencia del prototipo, no un cálculo conectado a cocina.
6. La cancelación se registra únicamente en el almacenamiento local; no notifica a cocina ni anula una orden real.
6. Debe realizarse una nueva prueba de usabilidad para afirmar mejora en eficacia, eficiencia o satisfacción.

## 5. Resultado

La versión contiene arquitectura separada, reglas de dominio, casos de uso, persistencia local y pruebas automatizadas de lógica. La aceptación de negocio y la validación con usuarios permanecen pendientes.
