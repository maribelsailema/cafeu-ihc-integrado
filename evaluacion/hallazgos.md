# Hallazgos – CaféU 2.0

## Hallazgos de evaluación heurística
1. Los mensajes toast de confirmación tienen duración corta (Severidad 2).
2. No existe ayuda contextual ni tooltips en acciones críticas (Severidad 2).
3. El tiempo de 5 segundos de la opción Deshacer puede resultar breve para algunos usuarios (Severidad 1).
4. El foco de teclado es poco contrastado en ciertos botones del carrito (Severidad 1).
5. Los mensajes de validación existen pero podrían ser más descriptivos (Severidad 1).

## Hallazgos de pruebas con usuarios (P01 y P02)
1. Ambos participantes completaron T1, T2 y T3 con éxito.
2. P01 utilizó la opción Deshacer y recuperó el producto eliminado sin dificultad.
3. La búsqueda tolerante a tildes y mayúsculas funcionó en los dos casos.
4. Los participantes notaron el total actualizado de forma inmediata al cambiar cantidades.
5. No se reportaron confusiones graves con los botones de acción.

## Contraste entre hallazgos heurísticos y observaciones de usuarios

| Hallazgo heurístico                          | Confirmado por usuarios | Observación |
|---------------------------------------------|-------------------------|-------------|
| Duración corta de mensajes toast            | Parcial                 | Ningún usuario perdió información crítica |
| Falta de tooltips / ayuda contextual        | No                      | No generó fallos en las tareas |
| Tiempo de Deshacer (5 s)                    | No                      | P01 lo usó con éxito |
| Foco de teclado poco visible                | No                      | No afectó la completación de tareas |
| Mensajes de validación poco descriptivos    | No                      | No se presentaron errores de validación durante las pruebas |