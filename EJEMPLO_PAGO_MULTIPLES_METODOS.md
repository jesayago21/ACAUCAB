# Ejemplo: Problema con Pagos Múltiples en Monedas Extranjeras

## Escenario del Problema

**Compra total:** Bs. 100.00
**Tasa de cambio:** 1 USD = Bs. 36.00

### Problema Original:
1. Cliente quiere pagar $2 USD (equivale a Bs. 72.00)
2. Cliente entrega un billete de $5 USD
3. **PROBLEMA:** El sistema calculaba mal el vuelto y el monto pendiente

### Lo que pasaba antes (INCORRECTO):
- Monto entregado: $5 USD
- Monto a pagar: $2 USD  
- Vuelto: $3 USD
- **Error:** El sistema aplicaba $5 USD completos (Bs. 180) en lugar de solo $2 USD (Bs. 72)
- Resultado: Monto pendiente quedaba negativo o con errores

## Solución Implementada

### Cambios en la lógica:

1. **Función `aplicarPago` corregida:**
```typescript
// ANTES (incorrecto)
const montoFinalAplicado = Math.min(monto, montoPendiente);

// AHORA (correcto)
if (tipoPago !== 'Efectivo') {
  if (monto > montoPendiente) {
    return; // No permitir sobrepago en otros métodos
  }
  montoFinalAplicado = Math.min(monto, montoPendiente);
} else {
  // Para efectivo, el monto aplicado es el menor entre lo que se paga y lo pendiente
  montoFinalAplicado = Math.min(monto, montoPendiente);
}
```

2. **Función `handlePagoEfectivo` mejorada:**
```typescript
// Validar que no se pague más de lo pendiente
if (montoPagarNum > montoPendienteEnMoneda) {
  return; // Las validaciones ahora se muestran visualmente
}

// El monto a pagar en la moneda seleccionada
const montoAplicadoEnMoneda = montoPagarNum;
// El vuelto en la moneda seleccionada
const vueltoEnMoneda = montoEntregadoNum - montoAplicadoEnMoneda;

// Convertir el monto aplicado a bolívares para el sistema
const montoAplicadoEnBs = calcularEquivalenteBolivares(montoAplicadoEnMoneda, monedaEfectivo);
```

### Ejemplo Correcto Ahora:

**Compra total:** Bs. 100.00
**Tasa:** 1 USD = Bs. 36.00

#### Paso 1: Pago en USD
- Monto entregado: $5 USD
- Monto a pagar: $2 USD (máximo permitido: $2.78 = Bs. 100 ÷ 36)
- Vuelto: $3 USD
- **Monto aplicado al sistema:** Bs. 72.00 (solo los $2 USD)
- **Monto pendiente:** Bs. 28.00

#### Paso 2: Completar con otro método
- Pendiente: Bs. 28.00
- Puede pagar con:
  - Efectivo VES: Bs. 28.00
  - Tarjeta: Bs. 28.00
  - Puntos: equivalente a Bs. 28.00

## Validaciones Agregadas

### En la interfaz:
1. **Monto máximo en moneda extranjera:**
   ```
   Máximo en USD: $2.78 (Bs. 100.00 ÷ 36.00)
   ```

2. **Validaciones visuales:**
   - ⚠️ El monto a pagar no puede ser mayor al entregado
   - ⚠️ El monto excede lo pendiente en USD

3. **Botón deshabilitado cuando:**
   - Monto a pagar > Monto entregado
   - Monto a pagar > Monto pendiente en la moneda

### En el backend:
- Logging detallado para debugging
- Validación de monedas soportadas
- Manejo correcto de tasas de cambio

## Logs para Debugging

Ahora puedes ver en la consola del navegador:
```
💰 Pago en efectivo: {
  monedaEfectivo: "USD",
  montoEntregado: 5,
  montoPagar: 2,
  montoAplicadoEnMoneda: 2,
  montoAplicadoEnBs: 72,
  vueltoEnMoneda: 3,
  montoPendiente: 100,
  montoPendienteEnMoneda: 2.78,
  tasa: 36
}
```

## Prueba Recomendada

1. **Crear una compra de Bs. 100.00**
2. **Pagar con múltiples métodos:**
   - $2 USD (entregando billete de $5) → Aplica Bs. 72, vuelto $3
   - Bs. 20 en efectivo VES → Aplica Bs. 20
   - Bs. 8 con puntos → Completa el pago

3. **Verificar que:**
   - El vuelto se calcula correctamente
   - El monto pendiente se actualiza correctamente
   - Se puede completar con otros métodos sin problemas 