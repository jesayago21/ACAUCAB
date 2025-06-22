UPDATE cliente SET puntos_acumulados = 100000
WHERE clave = 1;

INSERT INTO metodo_de_pago (moneda, tipo)
VALUES ('PUNTOS', 'Puntos');

SELECT * FROM metodo_de_pago;

-- VENTA ONLINE
-- Venta 1 online 
INSERT INTO venta_online ( fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario)
VALUES ('2025-06-17', 200.00, 'Av. Principal #1', 1, 1, 6);

INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online)
VALUES ('2025-06-17', 200.00, 11, 12, 71);
-- Venta 2 online
INSERT INTO venta_online ( fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario)
VALUES ('2025-06-17', 150.00, 'Av. Principal #1', 1, 1, 6);

INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online)
VALUES ('2025-06-17', 150.00, 11, 12, 72);
