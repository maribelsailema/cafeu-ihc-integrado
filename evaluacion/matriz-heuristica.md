# Matriz de Evaluación Heurística – Nielsen (CaféU 2.0)

| #  | Heurística de Nielsen                                      | Hallazgo                                                                 | Evidencia                                                                 | Severidad (0-4) |
|----|------------------------------------------------------------|--------------------------------------------------------------------------|---------------------------------------------------------------------------|-----------------|
| 1  | Visibilidad del estado del sistema                         | Los mensajes de confirmación al agregar producto son visibles pero de corta duración. | Toast aparece al agregar, pero desaparece rápido en dispositivos lentos. | 2 |
| 2  | Correspondencia entre el sistema y el mundo real           | El lenguaje es claro (“Total a pagar”, “Pago en caja”).                  | Textos consistentes con el contexto de cafetería universitaria.           | 0 |
| 3  | Control y libertad del usuario                             | Existe opción «Deshacer» durante 5 segundos al eliminar un producto.     | Implementado según C-03 / H-03. El usuario puede recuperar el ítem.       | 1 |
| 4  | Consistencia y estándares                                  | Los botones de acción mantienen estilo uniforme en todas las pantallas.  | Botones de agregar, modificar y confirmar siguen el mismo patrón visual.  | 0 |
| 5  | Prevención de errores                                      | Se requiere confirmación o se ofrece Deshacer al eliminar.               | Área táctil ≥ 44 px y Deshacer por 5 s (C-03).                            | 1 |
| 6  | Reconocimiento antes que recuerdo                          | El total se actualiza de forma inmediata y visible al cambiar cantidades.| Contador y total se refrescan al modificar (C-02).                        | 0 |
| 7  | Flexibilidad y eficiencia de uso                           | La búsqueda es tolerante a tildes y mayúsculas.                          | Implementado en dominio y presentación (RF02).                            | 0 |
| 8  | Diseño estético y minimalista                              | Interfaz limpia, Mobile First y sin elementos innecesarios.              | Cumple enfoque responsive.                                                | 0 |
| 9  | Ayuda a los usuarios a reconocer, diagnosticar y recuperarse de errores | Mensajes de validación claros; no se permite confirmar pedido vacío.     | Estado vacío y bloqueo de confirmación implementados (C-06, C-09).        | 1 |
| 10 | Ayuda y documentación                                      | No existe ayuda contextual ni tooltips en acciones críticas.             | Sigue siendo una limitación menor.                                        | 2 |

**Hallazgos prioritarios documentados (mínimo 5):**
1. Duración corta de los mensajes toast (Severidad 2)
2. Falta de ayuda contextual / tooltips (Severidad 2)
3. Área de eliminación y Deshacer funcionan, pero el tiempo de 5 s puede ser corto para algunos usuarios (Severidad 1)
4. Foco de teclado mejorable en algunos controles (Severidad 1)
5. Mensajes de error de validación presentes pero podrían ser más descriptivos (Severidad 1)