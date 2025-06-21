-- ========= INSERTS PARA ESTATUS DE COMPRAS DE MERCANCÍA =========
-- Estados permitidos por el trigger: procesando, listo para entrega, entregado
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (1, 'procesando', 'compra');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (2, 'listo para entrega', 'compra');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (3, 'entregado', 'compra');

-- ========= INSERTS PARA ESTATUS DE CUOTAS DE AFILIACIÓN =========
-- Estados permitidos por el trigger: por pagar, pagado, vencido
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (4, 'por pagar', 'cuota');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (5, 'pagado', 'cuota');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (6, 'vencido', 'cuota');

-- ========= INSERTS PARA ESTATUS DE VENTAS ONLINE =========
-- Estados permitidos por el trigger: procesando, listo para entrega, entregado
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (7, 'procesando', 'venta online');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (8, 'listo para entrega', 'venta online');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (9, 'entregado', 'venta online');

-- ========= INSERTS PARA ESTATUS DE REPOSICIÓN EN ESTANTES =========
-- Estados permitidos por el trigger: procesando, listo para entrega, entregado
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (10, 'procesando', 'reposicion');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (11, 'listo para entrega', 'reposicion');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (12, 'entregado', 'reposicion');

-- ===================================================================================
-- ACTUALIZACIÓN DE PUNTOS DE CLIENTES (ANTES DE LOS PAGOS)
-- ===================================================================================

-- Actualizar puntos de algunos clientes para permitir pagos con puntos
UPDATE cliente SET puntos_acumulados = 100 WHERE clave = 1; -- Cliente 1 ahora tiene 100 puntos
UPDATE cliente SET puntos_acumulados = 50 WHERE clave = 3;  -- Cliente 3 ahora tiene 50 puntos
UPDATE cliente SET puntos_acumulados = 25 WHERE clave = 5;  -- Cliente 5 ahora tiene 25 puntos (necesita 19 para 189.45)

-- =================================================================
-- INSERCIÓN DE DATOS EN LA TABLA 'historico'
-- Se simulan los ciclos de vida de diferentes entidades (Ventas, Compras, etc.)
-- basándose en las reglas de negocio y los estatus definidos.
-- =================================================================

-- ===================================================================================
-- BLOQUE 1: HISTORIAL COMPLETO PARA 5 VENTAS ONLINE
-- Se simula el ciclo de vida de 5 ventas, cumpliendo la regla de < 2 horas
-- para pasar de 'procesando' a 'listo para entrega'.
-- ===================================================================================

-- Historia para Venta Online con clave = 1
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-17 10:00:00', 7, 1), -- Estatus 7: procesando
('2025-06-17 11:30:15', 8, 1), -- Estatus 8: listo para entrega (dentro de las 2 horas)
('2025-06-17 16:45:00', 9, 1); -- Estatus 9: entregado

-- Historia para Venta Online con clave = 2
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-17 14:05:00', 7, 2), -- Estatus 7: procesando
('2025-06-17 15:50:00', 8, 2), -- Estatus 8: listo para entrega (dentro de las 2 horas)
('2025-06-18 11:00:00', 9, 2); -- Estatus 9: entregado al día siguiente

-- Historia para Venta Online con clave = 3
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-18 09:00:00', 7, 3), -- Estatus 7: procesando
('2025-06-18 09:45:30', 8, 3), -- Estatus 8: listo para entrega (procesamiento rápido)
('2025-06-18 15:20:00', 9, 3); -- Estatus 9: entregado

-- Historia para Venta Online con clave = 4 (Esta venta quedará 'Lista para Entrega' pero no 'Entregada')
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-18 18:10:00', 7, 4), -- Estatus 7: procesando
('2025-06-18 19:55:00', 8, 4); -- Estatus 8: listo para entrega (aún pendiente de despacho final)

-- Historia para Venta Online con clave = 5
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-19 13:00:00', 7, 5), -- Estatus 7: procesando
('2025-06-19 14:59:00', 8, 5), -- Estatus 8: listo para entrega (justo a tiempo)
('2025-06-19 19:00:00', 9, 5); -- Estatus 9: entregado al final del día

-- ===================================================================================
-- BLOQUE 2: HISTORIAL PARA 5 ÓRDENES DE COMPRA A PROVEEDORES
-- Se simula el ciclo de vida de 5 compras usando los estados correctos del trigger
-- ===================================================================================

-- Historia para Compra con clave = 1 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-01-10 10:00:00', 1, 1), -- Estatus 1: procesando
('2023-01-25 14:00:00', 2, 1), -- Estatus 2: listo para entrega
('2023-02-09 11:00:00', 3, 1); -- Estatus 3: entregado

-- Historia para Compra con clave = 2 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-02-15 11:00:00', 1, 2), -- Estatus 1: procesando
('2023-03-02 16:30:00', 2, 2), -- Estatus 2: listo para entrega
('2023-03-17 15:00:00', 3, 2); -- Estatus 3: entregado

-- Historia para Compra con clave = 3 (Quedará como 'Listo para entrega' pero pendiente de entrega)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-03-20 14:00:00', 1, 3), -- Estatus 1: procesando
('2023-04-05 12:00:00', 2, 3); -- Estatus 2: listo para entrega

-- Historia para Compra con clave = 4 (Quedará como 'Procesando')
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-04-05 15:00:00', 1, 4); -- Estatus 1: procesando

-- Historia para Compra con clave = 5 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-05-12 09:00:00', 1, 5), -- Estatus 1: procesando
('2023-05-30 11:45:00', 2, 5), -- Estatus 2: listo para entrega
('2023-06-14 14:00:00', 3, 5); -- Estatus 3: entregado

-- ===================================================================================
-- BLOQUE 3: HISTORIAL PARA 5 ÓRDENES DE REPOSICIÓN
-- Se simula el ciclo de vida de las órdenes de reposición usando los estados correctos
-- ===================================================================================

-- Historia para Reposición con clave = 1 (Ciclo completo y rápido)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-10 09:00:00', 10, 1), -- Estatus 10: procesando
('2025-06-10 09:15:00', 11, 1), -- Estatus 11: listo para entrega
('2025-06-10 10:00:00', 12, 1); -- Estatus 12: entregado

-- Historia para Reposición con clave = 2 (Ciclo completo, un poco más lento)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-11 14:00:00', 10, 2), -- Estatus 10: procesando
('2025-06-11 16:30:00', 11, 2), -- Estatus 11: listo para entrega
('2025-06-11 17:15:00', 12, 2); -- Estatus 12: entregado

-- Historia para Reposición con clave = 3 (Queda 'Listo para entrega')
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-12 08:30:00', 10, 3), -- Estatus 10: procesando
('2025-06-12 08:40:00', 11, 3); -- Estatus 11: listo para entrega

-- Historia para Reposición con clave = 4 (Queda 'Procesando', pendiente de acción)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-13 11:00:00', 10, 4); -- Estatus 10: procesando

-- Historia para Reposición con clave = 5 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-14 13:00:00', 10, 5), -- Estatus 10: procesando
('2025-06-14 13:05:00', 11, 5), -- Estatus 11: listo para entrega
('2025-06-14 13:45:00', 12, 5); -- Estatus 12: entregado

-- ===================================================================================
-- BLOQUE 4: HISTORIAL PARA 5 CUOTAS DE AFILIACIÓN
-- Se simulan diferentes escenarios de pago para las cuotas de los miembros.
-- Todas las cuotas se generan en Junio de 2025.
-- ===================================================================================

-- Historia para Cuota con clave = 1 (Pagada a tiempo)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-01 00:00:01', 4, 1), -- Estatus 4: por pagar (al momento de generarse)
('2025-06-05 10:30:00', 5, 1); -- Estatus 5: pagado (dentro del mes)

-- Historia para Cuota con clave = 2 (Pagada casi al final del mes)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-02 00:00:01', 4, 2), -- Estatus 4: por pagar
('2025-06-28 15:00:00', 5, 2); -- Estatus 5: pagado

-- Historia para Cuota con clave = 3 (Cuota que se venció)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-03 00:00:01', 4, 3), -- Estatus 4: por pagar
('2025-07-01 00:00:01', 6, 3); -- Estatus 6: vencido (al pasar al siguiente mes sin ser pagada)

-- Historia para Cuota con clave = 4 (Pagada a tiempo)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-04 00:00:01', 4, 4), -- Estatus 4: por pagar
('2025-06-10 11:45:00', 5, 4); -- Estatus 5: pagado

-- Historia para Cuota con clave = 5 (Aún está pendiente de pago)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-05 00:00:01', 4, 5); -- Estatus 4: por pagar (es el único estado que tiene hasta ahora)

-- ===================================================================================
-- BLOQUE 1: PAGOS PARA VENTAS ONLINE (5 registros)
-- Regla: Obligatoriamente con Tarjeta de Crédito.
-- Métodos de pago (TC): 2 (Usuario 1), 6 (Usuario 3), 10 (Usuario 5)
-- ===================================================================================

-- Pago para Venta Online 1 (Monto: 250.50, Usuario: 1)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-17', 250.50, 1, 2, 1);

-- Pago para Venta Online 3 (Monto: 300.75, Usuario: 3)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-18', 300.75, 2, 6, 3);

-- Pago para Venta Online 5 (Monto: 450.00, Usuario: 5)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-19', 450.00, 3, 10, 5);

-- Pago para Venta Online 7 (Monto: 95.00, Usuario: 7 -> usará una TC genérica si no tiene una preferida)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-20', 95.00, 4, 2, 7); -- Usando la TC del método 2 como ejemplo

-- Pago para Venta Online 9 (Monto: 500.00, Usuario: 9)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-21', 500.00, 5, 2, 9); -- Usando la TC del método 2 como ejemplo


-- ===================================================================================
-- BLOQUE 2: PAGOS PARA VENTAS EN TIENDA FÍSICA (5 registros)
-- Se usan diversos métodos de pago.
-- ===================================================================================

-- Pago para Venta Física 3 (Monto: 85.50) con Tarjeta de Débito
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-18', 85.50, 2, 4, 3); -- Método 4: Tarjeta de débito

-- Pago para Venta Física 5 (Monto: 190.00) con Cheque
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-19', 190.00, 3, 3, 5); -- Método 3: Cheque

-- Pago para Venta Física 7 (Monto: 450.00) con Efectivo (cambiado de Puntos porque el cliente no tiene suficientes puntos)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-20', 450.00, 4, 1, 7); -- Método 1: Efectivo (cambiado de 5: Puntos)

-- Pago para Venta Física 10 (Monto: 200.00) con Tarjeta de Crédito
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-21', 200.00, 5, 2, 10); -- Método 2: Tarjeta de Crédito


-- ===================================================================================
-- BLOQUE 3: PAGOS PARA CUOTAS DE AFILIACIÓN (5 registros)
-- Se vincula con el historial de cuotas pagadas y vencidas.
-- ===================================================================================

-- Pago para Cuota 1 (Monto: 500), pagada a tiempo.
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-05', 500.00, 6, 2, 1); -- Coincide con la fecha del historial 'Pagada'

-- Pago para Cuota 2 (Monto: 750), pagada a tiempo.
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-28', 750.00, 1, 1, 2); -- Fecha de pago de ejemplo

-- Pago para Cuota 4 (Monto: 850), pagada a tiempo.
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-10', 850.00, 7, 6, 4); -- Coincide con la fecha del historial 'Pagada'

-- Pago para Cuota 6 (Monto: 700)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-15', 700.00, 1, 4, 6);

-- Pago para Cuota 8 (Monto: 800)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-20', 800.00, 4, 2, 8);


-- ===================================================================================
-- BLOQUE 4: PAGOS PARA VENTAS DE EVENTOS (5 registros)
-- ===================================================================================

-- Pago para Venta de Evento 1 (Monto: 150.75)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-01', 150.75, 6, 1, 1);

-- Pago para Venta de Evento 2 (Monto: 200.50)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-02', 200.50, 6, 2, 2);

-- Pago para Venta de Evento 3 (Monto: 175.30)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-03', 175.30, 6, 3, 3);

-- Pago para Venta de Evento 4 (Monto: 220.90)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-04', 220.90, 6, 4, 4);

-- Pago para Venta de Evento 5 (Monto: 189.45)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-05', 189.45, 6, 5, 5);


-- ===================================================================================
-- BLOQUE 5: PAGOS PARA VENTAS DE ENTRADAS (5 registros)
-- ===================================================================================

-- Pago para Venta de Entrada 1 (Monto: 50.00)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-17', 50.00, 1, 1, 1);

-- Pago para Venta de Entrada 2 (Monto: 75.50)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-18', 75.50, 2, 2, 2);

-- Pago para Venta de Entrada 3 (Monto: 120.00)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-19', 120.00, 3, 3, 3);

-- Pago para Venta de Entrada 4 (Monto: 30.00)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-20', 30.00, 4, 4, 4);

-- Pago para Venta de Entrada 5 (Monto: 90.75)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-21', 90.75, 5, 5, 5);

-- ===================================================================================
-- Historico de ventas online (CORREGIDO: usando estatus correctos para ventas online)
-- Estatus 7: procesando, Estatus 8: listo para entrega, Estatus 9: entregado
-- ===================================================================================

-- Historico para ventas online 11-90 (todas en estado 'procesando')
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-20 10:00:00', 7, 11), -- Estatus 7: procesando para venta online
('2025-06-20 10:00:00', 7, 12), -- Estatus 7: procesando para venta online
('2025-06-21 10:00:00', 7, 13), -- Estatus 7: procesando para venta online
('2025-06-21 10:00:00', 7, 14), -- Estatus 7: procesando para venta online
('2025-06-22 10:00:00', 7, 15), -- Estatus 7: procesando para venta online
('2025-06-22 10:00:00', 7, 16), -- Estatus 7: procesando para venta online
('2025-06-23 10:00:00', 7, 17), -- Estatus 7: procesando para venta online
('2025-06-23 10:00:00', 7, 18), -- Estatus 7: procesando para venta online
('2025-06-24 10:00:00', 7, 19), -- Estatus 7: procesando para venta online
('2025-06-24 10:00:00', 7, 20), -- Estatus 7: procesando para venta online
('2025-07-20 10:00:00', 7, 21), -- Estatus 7: procesando para venta online
('2025-07-20 10:00:00', 7, 22), -- Estatus 7: procesando para venta online
('2025-07-21 10:00:00', 7, 23), -- Estatus 7: procesando para venta online
('2025-07-21 10:00:00', 7, 24), -- Estatus 7: procesando para venta online
('2025-07-22 10:00:00', 7, 25), -- Estatus 7: procesando para venta online
('2025-07-22 10:00:00', 7, 26), -- Estatus 7: procesando para venta online
('2025-07-23 10:00:00', 7, 27), -- Estatus 7: procesando para venta online
('2025-07-23 10:00:00', 7, 28), -- Estatus 7: procesando para venta online
('2025-07-24 10:00:00', 7, 29), -- Estatus 7: procesando para venta online
('2025-07-24 10:00:00', 7, 30), -- Estatus 7: procesando para venta online
('2025-08-20 10:00:00', 7, 31), -- Estatus 7: procesando para venta online
('2025-08-20 10:00:00', 7, 32), -- Estatus 7: procesando para venta online
('2025-08-21 10:00:00', 7, 33), -- Estatus 7: procesando para venta online
('2025-08-21 10:00:00', 7, 34), -- Estatus 7: procesando para venta online
('2025-08-22 10:00:00', 7, 35), -- Estatus 7: procesando para venta online
('2025-08-22 10:00:00', 7, 36), -- Estatus 7: procesando para venta online
('2025-08-23 10:00:00', 7, 37), -- Estatus 7: procesando para venta online
('2025-08-23 10:00:00', 7, 38), -- Estatus 7: procesando para venta online
('2025-08-24 10:00:00', 7, 39), -- Estatus 7: procesando para venta online
('2025-08-24 10:00:00', 7, 40), -- Estatus 7: procesando para venta online
('2025-08-20 10:00:00', 7, 41), -- Estatus 7: procesando para venta online
('2025-08-20 10:00:00', 7, 42), -- Estatus 7: procesando para venta online
('2025-08-21 10:00:00', 7, 43), -- Estatus 7: procesando para venta online
('2025-08-21 10:00:00', 7, 44), -- Estatus 7: procesando para venta online
('2025-09-22 10:00:00', 7, 45), -- Estatus 7: procesando para venta online
('2025-09-22 10:00:00', 7, 46), -- Estatus 7: procesando para venta online
('2025-09-23 10:00:00', 7, 47), -- Estatus 7: procesando para venta online
('2025-09-23 10:00:00', 7, 48), -- Estatus 7: procesando para venta online
('2025-09-24 10:00:00', 7, 49), -- Estatus 7: procesando para venta online
('2025-09-24 10:00:00', 7, 50), -- Estatus 7: procesando para venta online
('2025-09-20 10:00:00', 7, 51), -- Estatus 7: procesando para venta online
('2025-09-20 10:00:00', 7, 52), -- Estatus 7: procesando para venta online
('2025-09-21 10:00:00', 7, 53), -- Estatus 7: procesando para venta online
('2025-09-21 10:00:00', 7, 54), -- Estatus 7: procesando para venta online
('2025-09-22 10:00:00', 7, 55), -- Estatus 7: procesando para venta online
('2025-09-22 10:00:00', 7, 56), -- Estatus 7: procesando para venta online
('2025-10-23 10:00:00', 7, 57), -- Estatus 7: procesando para venta online
('2025-10-23 10:00:00', 7, 58), -- Estatus 7: procesando para venta online
('2025-10-24 10:00:00', 7, 59), -- Estatus 7: procesando para venta online
('2025-10-24 10:00:00', 7, 60), -- Estatus 7: procesando para venta online
('2025-10-20 10:00:00', 7, 61), -- Estatus 7: procesando para venta online
('2025-10-20 10:00:00', 7, 62), -- Estatus 7: procesando para venta online
('2025-10-21 10:00:00', 7, 63), -- Estatus 7: procesando para venta online
('2025-10-21 10:00:00', 7, 64), -- Estatus 7: procesando para venta online
('2025-10-22 10:00:00', 7, 65), -- Estatus 7: procesando para venta online
('2025-10-22 10:00:00', 7, 66), -- Estatus 7: procesando para venta online
('2025-10-23 10:00:00', 7, 67), -- Estatus 7: procesando para venta online
('2025-10-23 10:00:00', 7, 68), -- Estatus 7: procesando para venta online
('2025-10-24 10:00:00', 7, 69), -- Estatus 7: procesando para venta online
('2025-10-24 10:00:00', 7, 70), -- Estatus 7: procesando para venta online
('2025-11-20 10:00:00', 7, 71), -- Estatus 7: procesando para venta online
('2025-11-20 10:00:00', 7, 72), -- Estatus 7: procesando para venta online
('2025-11-21 10:00:00', 7, 73), -- Estatus 7: procesando para venta online
('2025-11-21 10:00:00', 7, 74), -- Estatus 7: procesando para venta online
('2025-11-22 10:00:00', 7, 75), -- Estatus 7: procesando para venta online
('2025-11-22 10:00:00', 7, 76), -- Estatus 7: procesando para venta online
('2025-11-23 10:00:00', 7, 77), -- Estatus 7: procesando para venta online
('2025-11-23 10:00:00', 7, 78), -- Estatus 7: procesando para venta online
('2025-11-24 10:00:00', 7, 79), -- Estatus 7: procesando para venta online
('2025-11-24 10:00:00', 7, 80), -- Estatus 7: procesando para venta online
('2025-12-20 10:00:00', 7, 81), -- Estatus 7: procesando para venta online
('2025-12-20 10:00:00', 7, 82), -- Estatus 7: procesando para venta online
('2025-12-21 10:00:00', 7, 83), -- Estatus 7: procesando para venta online
('2025-12-21 10:00:00', 7, 84), -- Estatus 7: procesando para venta online
('2025-12-22 10:00:00', 7, 85), -- Estatus 7: procesando para venta online
('2025-12-22 10:00:00', 7, 86), -- Estatus 7: procesando para venta online
('2025-12-23 10:00:00', 7, 87), -- Estatus 7: procesando para venta online
('2025-12-23 10:00:00', 7, 88), -- Estatus 7: procesando para venta online
('2025-12-24 10:00:00', 7, 89), -- Estatus 7: procesando para venta online
('2025-12-24 10:00:00', 7, 90); -- Estatus 7: procesando para venta online

-- ===================================================================================
-- PAGOS ADICIONALES CON PUNTOS (DESPUÉS DE ACTUALIZAR PUNTOS)
-- ===================================================================================

-- Pago para Venta Física 1 (Monto: 150.75) con Puntos (cliente 1 tiene 100 puntos, suficientes para 15 puntos)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-17', 150.75, 11, 5, 1); -- Método 5: Puntos (usando tasa 11 que es PUNTOS: 10.00)

-- Pago para Venta Física 7 (Monto: 450.00) con Efectivo (cambiado de Puntos porque el cliente no tiene suficientes puntos)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-20', 250.00, 4, 1, 7); -- Método 1: Efectivo (cambiado de 5: Puntos)
