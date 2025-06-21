DROP TYPE IF EXISTS tipo_moneda CASCADE;
DROP TYPE IF EXISTS tipo_metodo_pago CASCADE;
DROP TYPE IF EXISTS tipo_cliente CASCADE;
DROP VIEW IF EXISTS v_ventas_evento CASCADE;
DROP VIEW IF EXISTS v_ventas_tienda_fisica CASCADE;
DROP VIEW IF EXISTS v_ventas_online CASCADE;
DROP VIEW IF EXISTS v_ventas_tienda_fisica_detalle CASCADE;
DROP VIEW IF EXISTS v_ventas_online_detalle CASCADE;
DROP VIEW IF EXISTS v_ventas_evento_detalle CASCADE;
DROP VIEW IF EXISTS v_ventas_tienda_fisica_detalle CASCADE;
DROP TABLE IF EXISTS instruccion CASCADE;
DROP TABLE IF EXISTS tipo_invitado CASCADE;
DROP TABLE IF EXISTS inventario_evento CASCADE;
DROP TABLE IF EXISTS presentacion CASCADE;
DROP TABLE IF EXISTS inv_eve CASCADE;
DROP TABLE IF EXISTS metodo_de_pago CASCADE;
DROP TABLE IF EXISTS ing_rec CASCADE;
DROP TABLE IF EXISTS oferta CASCADE;
DROP TABLE IF EXISTS invitado CASCADE;
DROP TABLE IF EXISTS evento CASCADE;
DROP TABLE IF EXISTS tasa_cambio CASCADE;
DROP TABLE IF EXISTS asistencia CASCADE;
DROP TABLE IF EXISTS lugar CASCADE;
DROP TABLE IF EXISTS venta_entrada CASCADE;
DROP TABLE IF EXISTS estatus CASCADE;
DROP TABLE IF EXISTS contrato CASCADE;
DROP TABLE IF EXISTS rol_pri CASCADE;
DROP TABLE IF EXISTS tipo_beneficio CASCADE;
DROP TABLE IF EXISTS pago CASCADE;
DROP TABLE IF EXISTS historico CASCADE;
DROP TABLE IF EXISTS horario CASCADE;
DROP TABLE IF EXISTS tienda_online CASCADE;
DROP TABLE IF EXISTS eve_mie CASCADE;
DROP TABLE IF EXISTS inventario_tienda CASCADE;
DROP TABLE IF EXISTS departamento CASCADE;
DROP TABLE IF EXISTS venta_online CASCADE;
DROP TABLE IF EXISTS con_hor CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;
DROP TABLE IF EXISTS emp_ben CASCADE;
DROP TABLE IF EXISTS control_entrada CASCADE;
DROP TABLE IF EXISTS privilegio CASCADE;
DROP TABLE IF EXISTS detalle_venta_fisica CASCADE;
DROP TABLE IF EXISTS rol CASCADE;
DROP TABLE IF EXISTS cargo CASCADE;
DROP TABLE IF EXISTS almacen CASCADE;
DROP TABLE IF EXISTS car_cer CASCADE;
DROP TABLE IF EXISTS cuota CASCADE;
DROP TABLE IF EXISTS compra CASCADE;
DROP TABLE IF EXISTS vacacion CASCADE;
DROP TABLE IF EXISTS telefono CASCADE;
DROP TABLE IF EXISTS ingrediente CASCADE;
DROP TABLE IF EXISTS venta_evento CASCADE;
DROP TABLE IF EXISTS tipo_evento CASCADE;
DROP TABLE IF EXISTS lugar_tienda CASCADE;
DROP TABLE IF EXISTS reposicion CASCADE;
DROP TABLE IF EXISTS car_tip CASCADE;
DROP TABLE IF EXISTS caracteristica CASCADE;
DROP TABLE IF EXISTS persona_contacto CASCADE;
DROP TABLE IF EXISTS tienda_fisica CASCADE;
DROP TABLE IF EXISTS correo_electronico CASCADE;
DROP TABLE IF EXISTS tipo_cerveza CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS venta_tienda_fisica CASCADE;
DROP TABLE IF EXISTS detalle_venta_evento CASCADE;
DROP TABLE IF EXISTS detalle_compra CASCADE;
DROP TABLE IF EXISTS cerveza CASCADE;
DROP TABLE IF EXISTS detalle_venta_online CASCADE;
DROP TABLE IF EXISTS receta CASCADE;
DROP TABLE IF EXISTS miembro CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;

-- ===================================================================================
-- DROPS DE TRIGGERS
-- ===================================================================================

-- Trigger para validar período de oferta
DROP TRIGGER IF EXISTS tr_validar_periodo_oferta ON oferta;

-- Trigger para validar usuario en venta online
DROP TRIGGER IF EXISTS tr_validar_usuario_venta_online ON venta_online;

-- Trigger para actualizar puntos del cliente
DROP TRIGGER IF EXISTS tr_actualizar_puntos_cliente ON venta_tienda_fisica;

-- Trigger para validar tiempo de procesamiento
DROP TRIGGER IF EXISTS tr_validar_tiempo_procesamiento ON historico;

-- Trigger para generar orden de compra automática
DROP TRIGGER IF EXISTS tr_generar_orden_compra_automatica ON inventario_tienda;

-- Trigger para validar cambio de estatus de compra (comentado)
-- DROP TRIGGER IF EXISTS tr_validar_cambio_estatus_compra ON historico;

-- Trigger para generar orden de reposición
DROP TRIGGER IF EXISTS tr_generar_orden_reposicion ON inventario_tienda;

-- Trigger para validar estatus de entidad
DROP TRIGGER IF EXISTS tr_validar_estatus_entidad ON historico;

-- Trigger para validar método de pago online
DROP TRIGGER IF EXISTS tr_validar_metodo_pago_online ON pago;

-- Trigger para validar jerarquía de eventos
DROP TRIGGER IF EXISTS tr_validar_jerarquia_eventos ON evento;

-- Trigger para validar pago de compra (comentado)
-- DROP TRIGGER IF EXISTS tr_validar_pago_compra ON pago;

-- Trigger para descontar puntos del cliente
DROP TRIGGER IF EXISTS tr_descontar_puntos_cliente ON pago;

-- ===================================================================================
-- DROPS DE FUNCIONES
-- ===================================================================================

-- Funciones de triggers
DROP FUNCTION IF EXISTS validar_periodo_oferta() CASCADE;
DROP FUNCTION IF EXISTS validar_usuario_venta_online() CASCADE;
DROP FUNCTION IF EXISTS actualizar_puntos_cliente() CASCADE;
DROP FUNCTION IF EXISTS validar_tiempo_procesamiento() CASCADE;
DROP FUNCTION IF EXISTS generar_orden_compra_automatica() CASCADE;
-- DROP FUNCTION IF EXISTS validar_cambio_estatus_compra() CASCADE; -- Comentado
DROP FUNCTION IF EXISTS generar_orden_reposicion() CASCADE;
DROP FUNCTION IF EXISTS validar_estatus_entidad() CASCADE;
DROP FUNCTION IF EXISTS validar_metodo_pago_online() CASCADE;
DROP FUNCTION IF EXISTS validar_jerarquia_eventos() CASCADE;
-- DROP FUNCTION IF EXISTS validar_pago_compra() CASCADE; -- Comentado
DROP FUNCTION IF EXISTS descontar_puntos_cliente() CASCADE;
