# Validación de accesibilidad y diseño Mobile First - CaféU 2.0

## 1. Objetivo

Registrar la revisión de accesibilidad y adaptación a dispositivos móviles de la interfaz de CaféU 2.0. Este documento sirve como guía de comprobación para la versión implementada y como evidencia de las correcciones realizadas.

La validación debe ejecutarse sobre la aplicación en funcionamiento. No se deben marcar criterios como cumplidos únicamente por observar el código o el prototipo.

## 2. Alcance

Se revisan los siguientes aspectos:

* Adaptación de la interfaz a pantallas móviles y de escritorio.
* Uso de HTML semántico.
* Navegación mediante teclado.
* Visibilidad del foco.
* Etiquetas y nombres accesibles de los controles.
* Contraste y legibilidad.
* Comunicación de estados, errores y resultados.
* Uso de diálogos y modales.

## 3. Procedimiento de validación

### 3.1 Diseño Mobile First y responsive

* **Procedimiento:**
  1. Abrir la aplicación en el navegador.
  2. Activar las herramientas de desarrollador.
  3. Probar tamaños de pantalla móvil, tableta y escritorio.
  4. Revisar inicio, catálogo, detalle, carrito, confirmación y estados alternativos.
  5. Comprobar que no exista desplazamiento horizontal no intencional.

* **Criterios de aceptación:**
  * El contenido se adapta al ancho disponible.
  * Los textos y precios se mantienen legibles.
  * Los botones y controles pueden utilizarse sin dificultad.
  * Las tarjetas no se superponen.
  * El contenido importante no queda oculto.
  * La navegación sigue siendo comprensible en pantallas pequeñas.

* **Resultado de la revisión:** Pendiente de ejecución.
* **Observaciones/evidencia:** Agregar aquí los tamaños probados, problemas encontrados y nombres de las capturas.

### 3.2 HTML semántico

* **Procedimiento:**
  1. Revisar la estructura de cada pantalla.
  2. Comprobar que exista una estructura de encabezados coherente.
  3. Identificar las zonas de navegación y contenido principal.
  4. Verificar que las acciones se implementen con botones y los destinos de navegación con enlaces cuando corresponda.
  5. Comprobar que los campos de formulario tengan etiquetas asociadas.

* **Criterios de aceptación:**
  * La página utiliza elementos semánticos adecuados.
  * Los encabezados siguen un orden comprensible.
  * Los controles tienen una función identificable.
  * Los campos de entrada tienen etiquetas o nombres accesibles.
  * No se utilizan elementos visuales sin significado como sustitutos de controles interactivos.

* **Resultado de la revisión:** Pendiente de ejecución.

### 3.3 Navegación mediante teclado

* **Procedimiento:**
  1. Recargar la aplicación.
  2. Utilizar `Tab` para avanzar entre controles.
  3. Utilizar `Shift + Tab` para retroceder.
  4. Utilizar `Enter` o `Espacio` según el tipo de control.
  5. Comprobar que los controles no queden inaccesibles.

* **Criterios de aceptación:**
  * Los controles interactivos pueden alcanzarse con teclado.
  * El orden de navegación coincide con el orden lógico de la interfaz.
  * No se producen bloqueos involuntarios del foco.
  * Las acciones principales pueden ejecutarse sin ratón.

* **Resultado de la revisión:** Pendiente de ejecución.

### 3.4 Foco visible

* **Procedimiento:**
  1. Recorrer la interfaz con `Tab`.
  2. Observar el control que recibe el foco.
  3. Comprobar que el indicador se distinga del resto de la interfaz.
  4. Repetir la prueba en botones, enlaces, campos y controles del carrito.

* **Criterios de aceptación:**
  * El foco es visible en todos los controles interactivos.
  * El indicador tiene suficiente contraste.
  * El foco no queda oculto por otros elementos.
  * No se elimina el contorno de foco sin proporcionar una alternativa visual.

* **Ejemplo de estilo que puede adaptarse al diseño existente:**

```css
:where(button, a, input, select, textarea, [tabindex]):focus-visible {
  outline: 3px solid #9b7545;
  outline-offset: 3px;
}
```

> **Nota:** Este fragmento es una referencia; antes de incorporarlo se debe comprobar que el color contraste con los fondos reales de CaféU y que no interfiera con los estilos existentes.

* **Resultado de la revisión:** Pendiente de ejecución.

### 3.5 Contraste y legibilidad

* **Procedimiento:**
  1. Revisar textos sobre fondos claros y oscuros.
  2. Revisar etiquetas, precios, botones y mensajes de error.
  3. Comprobar que la información no dependa exclusivamente del color.
  4. Utilizar una herramienta de análisis de contraste para medir las combinaciones relevantes.

* **Criterios de aceptación:**
  * El texto normal alcanza una relación de contraste de al menos 4.5:1.
  * El texto grande alcanza al menos 3:1.
  * Los controles y elementos gráficos necesarios para comprender o utilizar la interfaz tienen contraste suficiente.
  * Los estados de error y éxito incluyen texto o señales adicionales al color.

* **Resultado de la revisión:** Pendiente de medición.

### 3.6 Etiquetas y nombres accesibles

* **Procedimiento:**
  1. Revisar botones que utilizan únicamente iconos.
  2. Comprobar que cada campo tenga una etiqueta comprensible.
  3. Comprobar que los botones indiquen claramente su acción.
  4. Verificar los textos alternativos de las imágenes informativas.

* **Criterios de aceptación:**
  * Los controles tienen nombres accesibles.
  * Los botones no dependen únicamente de su apariencia.
  * Las imágenes informativas cuentan con texto alternativo pertinente.
  * Las imágenes decorativas no generan anuncios redundantes.

* **Resultado de la revisión:** Pendiente de ejecución.

### 3.7 Mensajes dinámicos

* **Procedimiento:**
  1. Agregar un producto al carrito.
  2. Cambiar cantidades.
  3. Ejecutar una búsqueda sin resultados.
  4. Provocar o simular un error controlado cuando el entorno lo permita.
  5. Comprobar si los mensajes importantes se anuncian mediante tecnologías de asistencia.

* **Criterios de aceptación:**
  * Los cambios importantes se comunican al usuario.
  * Los mensajes de estado no requieren que el usuario busque visualmente dónde ocurrió el cambio.
  * Las regiones dinámicas utilizan atributos ARIA adecuados cuando son necesarios.

* **Referencia de implementación:**

```html
<div role="status" aria-live="polite" aria-atomic="true">
  Producto agregado al pedido.
</div>
```

> **Nota:** El texto anterior es un ejemplo. Debe adaptarse a los mensajes reales de la aplicación.

* **Resultado de la revisión:** Pendiente de ejecución.

### 3.8 Modal y gestión del foco

* **Procedimiento:**
  1. Abrir el modal de confirmación de cancelación.
  2. Comprobar que el foco se sitúe dentro del diálogo.
  3. Recorrer sus controles con teclado.
  4. Comprobar que el contenido de fondo no reciba interacción mientras el diálogo esté abierto.
  5. Cerrar el modal y verificar que el foco regrese al control que lo abrió.

* **Criterios de aceptación:**
  * El diálogo tiene un nombre accesible.
  * El foco se gestiona de forma coherente.
  * El usuario puede confirmar o cancelar la acción.
  * El cierre devuelve el foco al contexto anterior.
  * El modal no se cierra accidentalmente al interactuar con su contenido.

* **Resultado de la revisión:** Pendiente de ejecución.

## 4. Registro de resultados

Completar esta tabla después de realizar las pruebas:

| N.º | Criterio | Resultado | Problema encontrado | Corrección aplicada | Evidencia |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Diseño responsive | Pendiente | Por revisar | Por definir | Por adjuntar |
| **2** | HTML semántico | Pendiente | Por revisar | Por definir | Por adjuntar |
| **3** | Navegación con teclado | Pendiente | Por revisar | Por definir | Por adjuntar |
| **4** | Foco visible | Pendiente | Por revisar | Por definir | Por adjuntar |
| **5** | Contraste | Pendiente | Por medir | Por definir | Por adjuntar |
| **6** | Nombres accesibles | Pendiente | Por revisar | Por definir | Por adjuntar |
| **7** | Mensajes dinámicos | Pendiente | Por revisar | Por definir | Por adjuntar |
| **8** | Gestión del foco en modal | Pendiente | Por revisar | Por definir | Por adjuntar |

## 5. Evidencias

Guardar las capturas y registros de validación en:

```text
evidencias/
├── antes/
└── despues/
```

Se recomienda capturar:

* La interfaz móvil y de escritorio.
* El foco visible durante la navegación con teclado.
* El estado del modal abierto.
* Los mensajes de estado y error.
* La pantalla corregida después de cada ajuste.

Cada captura debe tener un nombre descriptivo y corresponder a una prueba real.

## 6. Estado del documento

* **Estado inicial:** Guía de validación preparada; pruebas pendientes.
* **Responsable:** Desarrollo Frontend.

> **Nota:** Actualizar los resultados después de ejecutar las pruebas. No declarar conformidad ni accesibilidad completa sin evidencia verificable.