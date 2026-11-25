# CaféU 2.0 – Sistema de pedidos para cafetería universitaria

Implementación académica basada en el prototipo CaféU y en la evidencia del repositorio APE6. La interfaz reproduce el flujo de Inicio, Menú, Detalle, Mi Pedido, Estado y Confirmación, e incorpora las mejoras técnicas priorizadas.

## Requisitos

- Node.js 20 o superior (incluye npm).
- Navegador moderno.
- Git (opcional).

## Instalación y ejecución

```bash
npm install
npm run dev
```

Vite mostrará la dirección local, normalmente `http://localhost:5173`.

## Compilar y probar

```bash
npm test
npm run build
npm run preview
```

## Arquitectura

El proyecto sigue Presentación → Aplicación → Dominio, con Infraestructura implementando los puertos definidos por Aplicación. Ver [`docs/arquitectura.md`](docs/arquitectura.md).

```text
src/
├── application/
│   ├── ports/
│   └── use-cases/
├── domain/
│   ├── entities/
│   ├── errors/
│   └── services/
├── infrastructure/
│   ├── catalogo/
│   └── persistence/
└── presentation/
tests/
docs/
evaluacion/
```

## Funcionalidades

- Catálogo local de demostración: Café americano ($1.50), Sánduche ($2.75), Capuchino ($2.00), Galleta de avena ($1.25).
- Filtrado por categoría y búsqueda tolerante a tildes y mayúsculas.
- Detalle con instrucciones especiales.
- Carrito con cantidades, subtotales y total calculado en dominio.
- Eliminación con opción «Deshacer» durante cinco segundos.
- Estado vacío y bloqueo de confirmación sin productos.
- Confirmación, número de pedido local, comprobante y modal de cancelación con estado CANCELADO.
- Persistencia del pedido en `localStorage`.

## Persistencia y datos

La aplicación guarda el pedido en `localStorage`, clave `cafeu.pedido.v2`. Para reiniciar la demostración, abrir las herramientas del navegador y ejecutar:

```js
localStorage.removeItem("cafeu.pedido.v2");
location.reload();
```

El catálogo y los precios son datos de demostración derivados de las pantallas visibles del prototipo; deben validarse con la cafetería antes de producción.

## Limitaciones conocidas

- No existe API, servidor, base de datos central ni autenticación.
- El pedido solo existe en el navegador actual; no se envía a la cafetería.
- No hay pago electrónico, inventario ni conexión con cocina/caja. La cancelación tampoco notifica a cocina.
- El código y tiempo estimado son demostrativos.
- La cancelación de un pedido confirmado no está expuesta como acción operativa.
- La persistencia local no debe usarse como registro de pedidos reales.
- Las pruebas incluidas son técnicas; no sustituyen un nuevo pilotaje de usabilidad.

## Trazabilidad de la evaluación V2

Los cambios y pendientes se documentan en [`evaluacion/validacion-v2.md`](evaluacion/validacion-v2.md). Se conservan las distinciones del APE6 entre hallazgos confirmados por usuarios y heurística, hallazgos solo heurísticos y observaciones condicionadas a versión.

## Equipo y colaboración

Cada integrante debe trabajar en una rama propia, realizar commits descriptivos y abrir un Pull Request. No se deben registrar commits en nombre de otra persona. Consultar [`docs/colaboracion-git.md`](docs/colaboracion-git.md).

## Licencia y uso

Proyecto académico. No desplegar como sistema real de pedidos sin backend, controles de seguridad, revisión de precios, operación de cafetería y validación funcional.
