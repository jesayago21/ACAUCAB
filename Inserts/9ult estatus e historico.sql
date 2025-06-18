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
