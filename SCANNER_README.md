# Scanner de Códigos de Barras - ACAUCAB

## 🎯 Funcionalidad Implementada

Se ha agregado una nueva funcionalidad que permite escanear códigos de barras con un scanner USB y agregar automáticamente los productos correspondientes al carrito de compras.

## 🔧 Características

### ✅ Funcionalidades Implementadas

1. **Detección automática de scanner USB**
   - El sistema detecta automáticamente cuando se conecta un scanner USB
   - Los códigos de barras se procesan en tiempo real

2. **Búsqueda de productos por EAN**
   - Utiliza el campo `ean_13` de los productos para buscar coincidencias
   - Busca en el catálogo de productos del ecommerce

3. **Agregado automático al carrito**
   - Cuando se encuentra un producto, se agrega automáticamente al carrito
   - Se muestra una notificación de éxito

4. **Notificaciones visuales**
   - Notificaciones de éxito (verde) cuando se encuentra el producto
   - Notificaciones de error (rojo) cuando no se encuentra el producto

5. **Control manual del scanner**
   - Botón para activar/desactivar el scanner
   - Indicador visual del estado del scanner

6. **Interfaz mejorada**
   - Indicadores visuales cuando el scanner está activo
   - Instrucciones claras para el usuario
   - Información del estado del scanner

## 🚀 Cómo Usar

### 1. Conectar el Scanner USB

1. Conecte su scanner USB al computador
2. El scanner debe estar configurado para enviar un Enter al final del código
3. Asegúrese de que el scanner esté funcionando correctamente

### 2. Activar el Scanner

1. Navegue al catálogo de productos (`/catalogo`)
2. El scanner se activa automáticamente al cargar la página
3. Verá un indicador verde que dice "Scanner activo"
4. El campo de búsqueda se resaltará en verde cuando el scanner esté activo

### 3. Escanear Productos

1. Con el scanner activo, apunte el scanner hacia un código de barras
2. El código se procesará automáticamente
3. Si el producto existe en la base de datos:
   - Se agregará automáticamente al carrito
   - Aparecerá una notificación verde de éxito
4. Si el producto no existe:
   - Aparecerá una notificación roja de error

### 4. Control Manual

- **Activar Scanner**: Haga clic en el botón verde "Activar Scanner"
- **Detener Scanner**: Haga clic en el botón rojo "Detener Scanner"
- **Ver estado**: El estado del scanner se muestra en la interfaz

## 📁 Archivos Modificados/Creados

### Nuevos Archivos

1. **`Frontend/Front final/src/hooks/useBarcodeScanner.ts`**
   - Hook personalizado para manejar la lectura de códigos de barras
   - Detección de entrada de teclado del scanner
   - Procesamiento de códigos EAN

2. **`Frontend/Front final/src/components/ScannerTest.tsx`**
   - Componente de prueba para verificar el funcionamiento del scanner
   - Interfaz de prueba con historial de escaneos

3. **`Frontend/Front final/src/pages/scanner-test.astro`**
   - Página de prueba para el scanner

4. **`SCANNER_README.md`**
   - Este archivo con las instrucciones

### Archivos Modificados

1. **`Frontend/Front final/src/components/VistaPrincipalCompra.tsx`**
   - Integración del hook `useBarcodeScanner`
   - Interfaz mejorada con indicadores del scanner
   - Botones de control del scanner
   - Notificaciones visuales

## 🔍 Cómo Funciona

### Flujo de Procesamiento

1. **Detección de entrada**: El hook escucha eventos de teclado
2. **Acumulación de caracteres**: Los caracteres se acumulan en un buffer
3. **Detección de Enter**: Cuando se detecta Enter, se procesa el código completo
4. **Búsqueda de producto**: Se busca el producto por EAN en la base de datos
5. **Agregado al carrito**: Si se encuentra, se agrega automáticamente
6. **Notificación**: Se muestra una notificación de éxito o error

### Debug del Scanner

Si el scanner no está funcionando correctamente, use el componente de debug:

1. **Acceder al debug**: Navegue a `/scanner-debug` (si está configurado)
2. **Activar el scanner**: Haga clic en "Activar Scanner"
3. **Probar entrada**: Presione teclas o use su scanner USB
4. **Observar logs**: Vea el log de teclas para verificar que se están detectando
5. **Verificar buffer**: El buffer debe acumular los caracteres correctamente

### Componentes de Prueba

- **ScannerTest**: Prueba completa con búsqueda de productos
- **ScannerDebug**: Debug básico para verificar entrada de teclado

### Configuración del Scanner

El scanner debe estar configurado para:
- Enviar caracteres ASCII normales
- Agregar un Enter al final del código
- Tener una velocidad de escaneo rápida (< 100ms entre caracteres)

## 🧪 Pruebas

### Componente de Prueba

Se ha creado un componente de prueba (`ScannerTest.tsx`) que permite:

1. **Probar el scanner** sin afectar el carrito real
2. **Ver el historial** de productos encontrados y no encontrados
3. **Verificar el estado** del scanner en tiempo real
4. **Limpiar el historial** para nuevas pruebas

### Cómo Acceder a la Prueba

1. Navegue a `/scanner-test` (si está configurado)
2. O importe el componente `ScannerTest` en cualquier página

## ⚠️ Consideraciones Técnicas

### Compatibilidad

- **Navegadores**: Funciona en todos los navegadores modernos
- **Scanners**: Compatible con la mayoría de scanners USB estándar
- **Sistemas**: Windows, macOS, Linux

### Limitaciones

1. **Códigos EAN**: Solo funciona con códigos EAN-13 que existan en la base de datos
2. **Velocidad**: El scanner debe enviar caracteres rápidamente (< 100ms entre caracteres)
3. **Formato**: El scanner debe enviar Enter al final del código

### Solución de Problemas

#### El scanner no funciona
1. **Verificar conexión**: Asegúrese de que el scanner esté conectado correctamente
2. **Probar en editor**: Pruebe el scanner en un editor de texto primero
3. **Usar debug**: Navegue a `/scanner-debug` para verificar que se detectan las teclas
4. **Verificar configuración**: El scanner debe enviar Enter al final del código
5. **Revisar consola**: Abra las herramientas de desarrollador y vea los logs

#### Productos no se encuentran
1. **Verificar EAN**: Asegúrese de que el código EAN existe en la base de datos
2. **Revisar stock**: Verifique que el producto tenga stock disponible
3. **Usar prueba manual**: Use el campo de prueba manual en `/scanner-test`
4. **Revisar logs**: Vea la consola del navegador para errores detallados

#### El scanner se activa/desactiva solo
1. **Comportamiento normal**: El scanner se activa automáticamente al cargar la página
2. **Control manual**: Use el botón manual para activar/desactivar
3. **Reactivar**: El scanner se reactiva al navegar de vuelta al catálogo

#### Event listener no funciona
1. **Verificar focus**: Asegúrese de que la página tenga el foco
2. **Probar debug**: Use `/scanner-debug` para verificar detección de teclas
3. **Revisar consola**: Busque mensajes de error en la consola
4. **Verificar permisos**: Algunos navegadores requieren interacción del usuario

## 🎉 Beneficios

### Para el Usuario
- **Rapidez**: Agregar productos al carrito sin usar el mouse
- **Precisión**: Evita errores de selección manual
- **Eficiencia**: Proceso más rápido para múltiples productos

### Para el Sistema
- **Integración**: Funciona con el sistema existente
- **Escalabilidad**: Fácil de extender para más funcionalidades
- **Mantenibilidad**: Código modular y bien documentado

## 🔮 Futuras Mejoras

1. **Soporte para otros formatos**: Códigos UPC, QR, etc.
2. **Configuración avanzada**: Ajustes de velocidad, formato, etc.
3. **Historial de escaneos**: Guardar historial en localStorage
4. **Sonidos**: Efectos de sonido para confirmación
5. **Modo offline**: Funcionamiento sin conexión a internet

## 📞 Soporte

Si tiene problemas con el scanner:

1. Verifique la conexión USB
2. Pruebe el scanner en un editor de texto
3. Revise la consola del navegador para errores
4. Contacte al equipo de desarrollo

---

**Desarrollado para ACAUCAB - Sistema de Gestión de Cervecería** 