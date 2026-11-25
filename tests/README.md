# Pruebas Automatizadas — CaféU 2.0



## Herramienta utilizada
Las pruebas automatizadas están implementadas con **Vitest** (`vitest ^2.1.8`) sobre TypeScript, ejecutando directamente las capas de Dominio, Aplicación e Infraestructura de CaféU 2.0.

## Cómo ejecutar las pruebas

1. Instalar dependencias (solo la primera vez):
   ```bash
   npm install
   ```
   *(En Windows PowerShell con política restrictiva de scripts, puedes usar `npm.cmd install`.)*

2. Ejecutar toda la suite de pruebas una sola vez:
   ```bash
   npm test
   ```
   *(o `npm.cmd test` en PowerShell)*

3. Ejecutar en modo observador (desarrollo):
   ```bash
   npm run test:watch
   ```

## Cobertura de pruebas en `tests/`

| Archivo | Propósito | Casos cubiertos |
| :--- | :--- | :--- |
| `tests/domain.test.ts` | Pruebas unitarias de Dominio | Cálculo de subtotales/totales, validación de cantidades (0, decimales, >99), agrupación de ítems iguales, bloqueo de pedido vacío o ya confirmado, búsqueda sin tildes ni mayúsculas. |
| `tests/use-cases.test.ts` | Pruebas de Casos de Uso | Ciclo agregar → modificar → eliminar → restaurar, confirmación + cancelación y rechazo de producto inexistente. |
| `tests/flujos-criticos.test.ts` | Pruebas funcionales críticas (T1, T2 y T3) sobre `CatalogoLocal` | **T1:** Buscar producto sin tildes (`cafe`, `SANDUCHE`) y agregar 2 unidades.<br>**T2:** Modificar cantidad a 3, verificar recálculo de subtotal/total y límites.<br>**T3:** Eliminar producto, recuperarlo con `deshacerEliminacion`, confirmar pedido (`CU-TEST-01`), bloqueo de edición posterior y cancelación controlada. |
