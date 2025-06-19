-- ========= INSERTS PARA ESTATUS DE COMPRAS DE MERCANCÍA =========
INSERT INTO estatus (estado, aplicable_a) VALUES ('Generada', 'compra');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Aprobada', 'compra');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Enviada a Proveedor', 'compra');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Aceptada por proveedor', 'compra');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Recibida', 'compra');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Pagada', 'compra');

-- ========= INSERTS PARA ESTATUS DE CUOTAS DE AFILIACIÓN =========
INSERT INTO estatus (estado, aplicable_a) VALUES ('Pendiente de Pago', 'cuota');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Pagada', 'cuota');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Vencida', 'cuota');

-- ========= INSERTS PARA ESTATUS DE VENTAS ONLINE =========
INSERT INTO estatus (estado, aplicable_a) VALUES ('Procesando', 'venta online');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Listo para la Entrega', 'venta online');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Entregado', 'venta online');

-- ========= INSERTS PARA ESTATUS DE REPOSICIÓN EN ESTANTES =========
INSERT INTO estatus (estado, aplicable_a) VALUES ('Reposición Requerida', 'reposicion');
INSERT INTO estatus (estado, aplicable_a) VALUES ('En Proceso', 'reposicion');
INSERT INTO estatus (estado, aplicable_a) VALUES ('Completada', 'reposicion');


-- =================================================================
-- INSERCIÓN DE DATOS EN LA TABLA 'historico'
-- Se simulan los ciclos de vida de diferentes entidades (Ventas, Compras, etc.)
-- basándose en las reglas de negocio y los estatus definidos.
-- =================================================================
-- ===================================================================================
-- BLOQUE 1: HISTORIAL COMPLETO PARA 5 VENTAS ONLINE
-- Se simula el ciclo de vida de 5 ventas, cumpliendo la regla de < 2 horas
-- para pasar de 'Procesando' a 'Listo para la Entrega'.
-- ===================================================================================

-- Historia para Venta Online con clave = 1
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-17 10:00:00', 10, 1), -- Estatus 10: Procesando
('2025-06-17 11:30:15', 11, 1), -- Estatus 11: Listo para la Entrega (dentro de las 2 horas)
('2025-06-17 16:45:00', 12, 1); -- Estatus 12: Entregado

-- Historia para Venta Online con clave = 2
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-17 14:05:00', 10, 2), -- Estatus 10: Procesando
('2025-06-17 15:50:00', 11, 2), -- Estatus 11: Listo para la Entrega (dentro de las 2 horas)
('2025-06-18 11:00:00', 12, 2); -- Estatus 12: Entregado al día siguiente

-- Historia para Venta Online con clave = 3
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-18 09:00:00', 10, 3), -- Estatus 10: Procesando
('2025-06-18 09:45:30', 11, 3), -- Estatus 11: Listo para la Entrega (procesamiento rápido)
('2025-06-18 15:20:00', 12, 3); -- Estatus 12: Entregado

-- Historia para Venta Online con clave = 4 (Esta venta quedará 'Lista para Entrega' pero no 'Entregada')
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-18 18:10:00', 10, 4), -- Estatus 10: Procesando
('2025-06-18 19:55:00', 11, 4); -- Estatus 11: Listo para la Entrega (aún pendiente de despacho final)

-- Historia para Venta Online con clave = 5
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-19 13:00:00', 10, 5), -- Estatus 10: Procesando
('2025-06-19 14:59:00', 11, 5), -- Estatus 11: Listo para la Entrega (justo a tiempo)
('2025-06-19 19:00:00', 12, 5); -- Estatus 12: Entregado al final del día


-- ===================================================================================
-- BLOQUE 2: HISTORIAL PARA 5 ÓRDENES DE COMPRA A PROVEEDORES
-- Se simula el ciclo de vida de 5 compras, cumpliendo la regla de pagar
-- 15 días DESPUÉS de haber 'Recibido' la mercancía.
-- ===================================================================================

-- Historia para Compra con clave = 1 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-01-10 10:00:00', 1, 1), -- Estatus 1: Generada
('2023-01-11 09:30:00', 2, 1), -- Estatus 2: Aprobada
('2023-01-11 09:35:00', 3, 1), -- Estatus 3: Enviada a Proveedor
('2023-01-25 14:00:00', 5, 1), -- Estatus 5: Recibida
('2023-02-09 11:00:00', 6, 1); -- Estatus 6: Pagada (15 días después de la recepción del 25/01)

-- Historia para Compra con clave = 2 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-02-15 11:00:00', 1, 2), -- Estatus 1: Generada
('2023-02-16 10:00:00', 2, 2), -- Estatus 2: Aprobada
('2023-02-16 10:10:00', 3, 2), -- Estatus 3: Enviada a Proveedor
('2023-03-02 16:30:00', 5, 2), -- Estatus 5: Recibida
('2023-03-17 15:00:00', 6, 2); -- Estatus 6: Pagada (15 días después de la recepción del 02/03)

-- Historia para Compra con clave = 3 (Quedará como 'Recibida' pero pendiente de pago)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-03-20 14:00:00', 1, 3), -- Estatus 1: Generada
('2023-03-21 11:00:00', 2, 3), -- Estatus 2: Aprobada
('2023-03-21 11:05:00', 3, 3), -- Estatus 3: Enviada a Proveedor
('2023-04-05 12:00:00', 5, 3); -- Estatus 5: Recibida (el pago estaría pautado para el 20/04)

-- Historia para Compra con clave = 4 (Quedará como 'Enviada' pero no recibida)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-04-05 15:00:00', 1, 4), -- Estatus 1: Generada
('2023-04-06 16:00:00', 2, 4), -- Estatus 2: Aprobada
('2023-04-06 16:05:00', 3, 4); -- Estatus 3: Enviada a Proveedor (aún en tránsito)

-- Historia para Compra con clave = 5 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-05-12 09:00:00', 1, 5), -- Estatus 1: Generada
('2023-05-15 10:30:00', 2, 5), -- Estatus 2: Aprobada (después del fin de semana)
('2023-05-15 10:32:00', 3, 5), -- Estatus 3: Enviada a Proveedor
('2023-05-30 11:45:00', 5, 5), -- Estatus 5: Recibida
('2023-06-14 14:00:00', 6, 5); -- Estatus 6: Pagada (15 días después de la recepción del 30/05)

-- ===================================================================================
-- BLOQUE 1: HISTORIAL PARA 5 ÓRDENES DE REPOSICIÓN
-- Se simula el ciclo de vida de las órdenes de reposición para los anaqueles.
-- ===================================================================================

-- Historia para Reposición con clave = 1 (Ciclo completo y rápido)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-10 09:00:00', 13, 1), -- Estatus 13: Reposición Requerida (notificación al jefe de pasillo)
('2025-06-10 09:15:00', 14, 1), -- Estatus 14: En Proceso (el jefe aprueba y se inicia la tarea)
('2025-06-10 10:00:00', 15, 1); -- Estatus 15: Completada (el producto ya está en el anaquel)

-- Historia para Reposición con clave = 2 (Ciclo completo, un poco más lento)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-11 14:00:00', 13, 2), -- Estatus 13: Reposición Requerida
('2025-06-11 16:30:00', 14, 2), -- Estatus 14: En Proceso
('2025-06-11 17:15:00', 15, 2); -- Estatus 15: Completada

-- Historia para Reposición con clave = 3 (Queda 'En Proceso')
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-12 08:30:00', 13, 3), -- Estatus 13: Reposición Requerida
('2025-06-12 08:40:00', 14, 3); -- Estatus 14: En Proceso (la tarea aún no ha finalizado)

-- Historia para Reposición con clave = 4 (Queda 'Requerida', pendiente de acción)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-13 11:00:00', 13, 4); -- Estatus 13: Reposición Requerida (el jefe de pasillo aún no ha aprobado)

-- Historia para Reposición con clave = 5 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-14 13:00:00', 13, 5), -- Estatus 13: Reposición Requerida
('2025-06-14 13:05:00', 14, 5), -- Estatus 14: En Proceso
('2025-06-14 13:45:00', 15, 5); -- Estatus 15: Completada


-- ===================================================================================
-- BLOQUE 2: HISTORIAL PARA 5 CUOTAS DE AFILIACIÓN
-- Se simulan diferentes escenarios de pago para las cuotas de los miembros.
-- Todas las cuotas se generan en Junio de 2025.
-- ===================================================================================

-- Historia para Cuota con clave = 1 (Pagada a tiempo)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-01 00:00:01', 7, 1), -- Estatus 7: Pendiente de Pago (al momento de generarse)
('2025-06-05 10:30:00', 8, 1); -- Estatus 8: Pagada (dentro del mes)

-- Historia para Cuota con clave = 2 (Pagada casi al final del mes)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-02 00:00:01', 7, 2), -- Estatus 7: Pendiente de Pago
('2025-06-28 15:00:00', 8, 2); -- Estatus 8: Pagada

-- Historia para Cuota con clave = 3 (Cuota que se venció)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-03 00:00:01', 7, 3), -- Estatus 7: Pendiente de Pago
('2025-07-01 00:00:01', 9, 3); -- Estatus 9: Vencida (al pasar al siguiente mes sin ser pagada)

-- Historia para Cuota con clave = 4 (Pagada a tiempo)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-04 00:00:01', 7, 4), -- Estatus 7: Pendiente de Pago
('2025-06-10 11:45:00', 8, 4); -- Estatus 8: Pagada

-- Historia para Cuota con clave = 5 (Aún está pendiente de pago)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-05 00:00:01', 7, 5); -- Estatus 7: Pendiente de Pago (es el único estado que tiene hasta ahora)


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

-- Pago para Venta Física 1 (Monto: 150.75) con Efectivo
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-17', 150.75, 1, 1, 1); -- Método 1: Efectivo

-- Pago para Venta Física 3 (Monto: 85.50) con Tarjeta de Débito
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-18', 85.50, 2, 4, 3); -- Método 4: Tarjeta de débito

-- Pago para Venta Física 5 (Monto: 190.00) con Cheque
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-19', 190.00, 3, 3, 5); -- Método 3: Cheque

-- Pago para Venta Física 7 (Monto: 450.00) con Puntos
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-20', 450.00, 4, 5, 7); -- Método 5: Puntos

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
-- Historico de ordenes de compra 
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-20 10:00:00', 10, 11),
('2025-06-20 10:00:00', 10, 12),
('2025-06-21 10:00:00', 10, 13),
('2025-06-21 10:00:00', 10, 14),
('2025-06-22 10:00:00', 10, 15),
('2025-06-22 10:00:00', 10, 16),
('2025-06-23 10:00:00', 10, 17),
('2025-06-23 10:00:00', 10, 18),
('2025-06-24 10:00:00', 10, 19),
('2025-06-24 10:00:00', 10, 20),
('2025-07-20 10:00:00', 10, 21),
('2025-07-20 10:00:00', 10, 22),
('2025-07-21 10:00:00', 10, 23),
('2025-07-21 10:00:00', 10, 24),
('2025-07-22 10:00:00', 10, 25),
('2025-07-22 10:00:00', 10, 26),
('2025-07-23 10:00:00', 10, 27),
('2025-07-23 10:00:00', 10, 28),
('2025-07-24 10:00:00', 10, 29),
('2025-07-24 10:00:00', 10, 30),
('2025-08-20 10:00:00', 10, 31),
('2025-08-20 10:00:00', 10, 32),
('2025-08-21 10:00:00', 10, 33),
('2025-08-21 10:00:00', 10, 34),
('2025-08-22 10:00:00', 10, 35),
('2025-08-22 10:00:00', 10, 36),
('2025-08-23 10:00:00', 10, 37),
('2025-08-23 10:00:00', 10, 38),
('2025-08-24 10:00:00', 10, 39),
('2025-08-24 10:00:00', 10, 40),
('2025-08-20 10:00:00', 10, 41),
('2025-08-20 10:00:00', 10, 42),
('2025-08-21 10:00:00', 10, 43),
('2025-08-21 10:00:00', 10, 44),
('2025-09-22 10:00:00', 10, 45),
('2025-09-22 10:00:00', 10, 46),
('2025-09-23 10:00:00', 10, 47),
('2025-09-23 10:00:00', 10, 48),
('2025-09-24 10:00:00', 10, 49),
('2025-09-24 10:00:00', 10, 50),
('2025-09-20 10:00:00', 10, 51),
('2025-09-20 10:00:00', 10, 52),
('2025-09-21 10:00:00', 10, 53),
('2025-09-21 10:00:00', 10, 54),
('2025-09-22 10:00:00', 10, 55),
('2025-09-22 10:00:00', 10, 56),
('2025-10-23 10:00:00', 10, 57),
('2025-10-23 10:00:00', 10, 58),
('2025-10-24 10:00:00', 10, 59),
('2025-10-24 10:00:00', 10, 60),
('2025-10-20 10:00:00', 10, 61),
('2025-10-20 10:00:00', 10, 62),
('2025-10-21 10:00:00', 10, 63),
('2025-10-21 10:00:00', 10, 64),
('2025-10-22 10:00:00', 10, 65),
('2025-10-22 10:00:00', 10, 66),
('2025-10-23 10:00:00', 10, 67),
('2025-10-23 10:00:00', 10, 68),
('2025-10-24 10:00:00', 10, 69),
('2025-10-24 10:00:00', 10, 70),
('2025-11-20 10:00:00', 10, 71),
('2025-11-20 10:00:00', 10, 72),
('2025-11-21 10:00:00', 10, 73),
('2025-11-21 10:00:00', 10, 74),
('2025-11-22 10:00:00', 10, 75),
('2025-11-22 10:00:00', 10, 76),
('2025-11-23 10:00:00', 10, 77),
('2025-11-23 10:00:00', 10, 78),
('2025-11-24 10:00:00', 10, 79),
('2025-11-24 10:00:00', 10, 80),
('2025-12-20 10:00:00', 10, 81),
('2025-12-20 10:00:00', 10, 82),
('2025-12-21 10:00:00', 10, 83),
('2025-12-21 10:00:00', 10, 84),
('2025-12-22 10:00:00', 10, 85),
('2025-12-22 10:00:00', 10, 86),
('2025-12-23 10:00:00', 10, 87),
('2025-12-23 10:00:00', 10, 88),
('2025-12-24 10:00:00', 10, 89),
('2025-12-24 10:00:00', 10, 90);
