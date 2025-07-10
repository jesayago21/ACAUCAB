-- Trigger para validar que las ofertas se publiquen cada 30 días
CREATE OR REPLACE FUNCTION validar_periodo_oferta()
RETURNS TRIGGER AS $$
DECLARE
    ultima_fecha_fin DATE;
BEGIN
    -- Verificar si existe una oferta anterior para el mismo producto
    IF EXISTS (
        SELECT 1 
        FROM oferta 
        WHERE fk_presentacion = NEW.fk_presentacion 
        AND fecha_fin >= (NEW.fecha_inicio - INTERVAL '30 days')
    ) THEN
        RAISE EXCEPTION 'Debe esperar al menos 30 días después de la última oferta para este producto';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_validar_periodo_oferta ON oferta;
CREATE TRIGGER tr_validar_periodo_oferta
BEFORE INSERT ON oferta
FOR EACH ROW
EXECUTE FUNCTION validar_periodo_oferta();

-- Trigger para validar que el usuario que realiza una venta online esté asociado a un cliente
CREATE OR REPLACE FUNCTION validar_usuario_venta_online()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM usuario u
        WHERE u.clave = NEW.fk_usuario 
        AND u.fk_cliente IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'El usuario debe estar asociado a un cliente para realizar compras online';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_validar_usuario_venta_online ON venta_online;
CREATE TRIGGER tr_validar_usuario_venta_online
BEFORE INSERT ON venta_online
FOR EACH ROW
EXECUTE FUNCTION validar_usuario_venta_online();

/*DEBERIA SER A PARTIR DE QUE LOS PAGOS SUMEN EL TOTAL DE LA VENTA
-- Trigger para actualizar puntos del cliente después de una venta física
CREATE OR REPLACE FUNCTION actualizar_puntos_cliente()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar los puntos del cliente basado en la cantidad de productos comprados
    UPDATE cliente c
    SET puntos_acumulados = puntos_acumulados + NEW.cantidad
    FROM venta_tienda_fisica v
    WHERE v.clave = NEW.fk_venta_tienda_fisica 
    AND v.fk_cliente = c.clave;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_actualizar_puntos_cliente ON detalle_venta_fisica;
CREATE TRIGGER tr_actualizar_puntos_cliente
AFTER INSERT ON detalle_venta_fisica
FOR EACH ROW
EXECUTE FUNCTION actualizar_puntos_cliente();
*/


-- Trigger para validar el tiempo entre estados de procesamiento
CREATE OR REPLACE FUNCTION validar_tiempo_procesamiento()
RETURNS TRIGGER AS $$
DECLARE
    estado_anterior record;
BEGIN
    -- Buscar el estado anterior de 'procesando'
    SELECT h.* INTO estado_anterior
    FROM historico h
    JOIN estatus e ON e.clave = h.fk_estatus
    WHERE (h.fk_venta_online = NEW.fk_venta_online)
    AND e.estado = 'procesando'
    ORDER BY h.fecha DESC
    LIMIT 1;

    -- Si encontramos un estado 'procesando' y el nuevo es 'listo para entrega'
    IF estado_anterior IS NOT NULL AND 
       (SELECT estado FROM estatus WHERE clave = NEW.fk_estatus) = 'listo para entrega' AND
       (NEW.fecha - estado_anterior.fecha) > INTERVAL '2 hours' THEN
        RAISE EXCEPTION 'No pueden pasar más de dos horas entre el estado procesando y listo para entrega';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_validar_tiempo_procesamiento ON historico;
CREATE TRIGGER tr_validar_tiempo_procesamiento
BEFORE INSERT ON historico
FOR EACH ROW
EXECUTE FUNCTION validar_tiempo_procesamiento();

-- Trigger para generar órdenes de compra automáticas
CREATE OR REPLACE FUNCTION generar_orden_compra_automatica()
RETURNS TRIGGER AS $$
DECLARE
    v_miembro_id INT;
    v_compra_id INT;
BEGIN
    -- Si la cantidad es menor o igual a 100 unidades
    IF NEW.cantidad_unidades <= 100 THEN
        -- Obtener el miembro correspondiente a la cerveza
        SELECT m.rif INTO v_miembro_id
        FROM miembro m
        JOIN cerveza c ON c.fk_miembro = m.rif
        JOIN presentacion p ON p.fk_cerveza = c.clave
        JOIN almacen a ON a.fk_presentacion = p.clave
        WHERE a.clave = NEW.clave;
        
        IF v_miembro_id IS NULL THEN
            RAISE EXCEPTION 'No se encontró el miembro correspondiente para esta cerveza';
        END IF;
        
        -- Crear nueva compra
        INSERT INTO compra (fecha, monto_total, fk_miembro)
        VALUES (CURRENT_DATE, 0, v_miembro_id)
        RETURNING clave INTO v_compra_id;
        
        -- Crear detalle de compra con 10000 unidades
        INSERT INTO detalle_compra (fk_almacen, fk_compra, cantidad, precio_unitario)
        VALUES (NEW.clave, v_compra_id, 10000, 0);  -- El precio_unitario debería definirse según la lógica de negocio
        
        -- Insertar el primer estado en histórico
        INSERT INTO historico (fecha, fk_estatus, fk_compra)
        VALUES (CURRENT_DATE, 
               (SELECT clave FROM estatus WHERE estado = 'procesando' AND aplicable_a = 'compra' LIMIT 1),
               v_compra_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_generar_orden_compra_automatica ON almacen;
CREATE TRIGGER tr_generar_orden_compra_automatica
AFTER UPDATE ON almacen
FOR EACH ROW
EXECUTE FUNCTION generar_orden_compra_automatica();

-- Trigger para validar que solo el jefe de compras pueda cambiar el estatus de una orden de compra
-- Versión simplificada y funcional

CREATE OR REPLACE FUNCTION validar_cambio_estatus_compra()
RETURNS TRIGGER AS $$
DECLARE
    usuario_actual_id INTEGER;
    es_jefe_compras BOOLEAN;
    es_administrador BOOLEAN;
    estatus_actual VARCHAR(50);
    estatus_nuevo VARCHAR(50);
BEGIN
    -- Solo validar si es una compra
    IF NEW.fk_compra IS NOT NULL THEN
        -- Obtener el ID del usuario actual desde la variable de sesión
        usuario_actual_id := NULLIF(current_setting('app.current_user_id', true), '')::INTEGER;
        
        -- Si tenemos un usuario identificado, verificar sus permisos
        IF usuario_actual_id IS NOT NULL AND usuario_actual_id > 0 THEN
            -- Verificar si el usuario tiene el rol de jefe de compras
            SELECT EXISTS (
                SELECT 1
                FROM usuario u
                JOIN rol r ON r.clave = u.fk_rol
                WHERE u.clave = usuario_actual_id
                AND r.nombre = 'Jefe de Compras'
            ) INTO es_jefe_compras;
            
            -- Verificar si el usuario es administrador
            SELECT EXISTS (
                SELECT 1
                FROM usuario u
                JOIN rol r ON r.clave = u.fk_rol
                WHERE u.clave = usuario_actual_id
                AND r.nombre = 'Administrador'
            ) INTO es_administrador;
            
            -- Obtener los estatus para el mensaje de error
            IF TG_OP = 'UPDATE' THEN
                SELECT estado INTO estatus_actual
                FROM estatus 
                WHERE clave = OLD.fk_estatus;
            END IF;
            
            SELECT estado INTO estatus_nuevo
            FROM estatus 
            WHERE clave = NEW.fk_estatus;
            
            -- Si no es jefe de compras ni administrador, lanzar excepción
            IF NOT (es_jefe_compras OR es_administrador) THEN
                RAISE EXCEPTION 'Acceso denegado: Solo el jefe de compras o administrador puede cambiar el estatus de una orden de compra. Usuario ID: %, Estatus anterior: %, Estatus nuevo: %', 
                usuario_actual_id, 
                COALESCE(estatus_actual, 'N/A'), 
                COALESCE(estatus_nuevo, 'N/A');
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar cambios de estatus
DROP TRIGGER IF EXISTS tr_validar_cambio_estatus_compra ON historico;
CREATE TRIGGER tr_validar_cambio_estatus_compra
BEFORE INSERT OR UPDATE ON historico
FOR EACH ROW
EXECUTE FUNCTION validar_cambio_estatus_compra();

-- Función para establecer el usuario actual en la sesión
CREATE OR REPLACE FUNCTION establecer_usuario_actual(user_id INTEGER)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id::TEXT, false);
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar el usuario actual de la sesión
CREATE OR REPLACE FUNCTION limpiar_usuario_actual()
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', '', false);
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar órdenes de reposición automáticas
CREATE OR REPLACE FUNCTION generar_orden_reposicion()
RETURNS TRIGGER AS $$
DECLARE
    v_almacen_id INT;
    v_usuario_id INT;
BEGIN
    -- Si la cantidad es menor o igual a 20 unidades
    IF NEW.cantidad <= 20 THEN
        -- Obtener el almacén correspondiente a la presentación
        SELECT a.clave INTO v_almacen_id
        FROM almacen a
        WHERE a.fk_presentacion = NEW.fk_presentacion;
        
        -- Obtener un usuario con rol de jefe de pasillo (esto debería ajustarse según tu lógica)
        SELECT u.clave INTO v_usuario_id
        FROM usuario u
        JOIN rol r ON r.clave = u.fk_rol
        WHERE r.nombre = 'Jefe de Pasillo'
        LIMIT 1;
        
        -- Crear la reposición si se encontró un jefe de pasillo
        IF v_usuario_id IS NOT NULL THEN
            INSERT INTO reposicion (fecha_solicitud, fk_almacen, fk_inventario_tienda, fk_usuario)
            VALUES (CURRENT_DATE, v_almacen_id, NEW.clave, v_usuario_id);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_generar_orden_reposicion ON inventario_tienda;
CREATE TRIGGER tr_generar_orden_reposicion
AFTER UPDATE ON inventario_tienda
FOR EACH ROW
EXECUTE FUNCTION generar_orden_reposicion();

/*
-- Trigger para validar que el estatus de una entidad corresponda al tipo correcto
CREATE OR REPLACE FUNCTION validar_estatus_entidad()
RETURNS TRIGGER AS $$
DECLARE
    estatus_aplicable_a VARCHAR(50);
BEGIN
    -- Obtener a qué tipo de entidad se aplica el estatus
    SELECT aplicable_a INTO estatus_aplicable_a
    FROM estatus
    WHERE clave = NEW.fk_estatus;
    
    -- Validar que el estatus corresponda a la entidad correcta
    IF (NEW.fk_venta_online IS NOT NULL AND estatus_aplicable_a <> 'venta_online') OR
       (NEW.fk_compra IS NOT NULL AND estatus_aplicable_a <> 'compra') OR
       (NEW.fk_reposicion IS NOT NULL AND estatus_aplicable_a <> 'reposicion') THEN
        RAISE EXCEPTION 'El estatus % no es aplicable a esta entidad', NEW.fk_estatus;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_validar_estatus_entidad ON historico;
CREATE TRIGGER tr_validar_estatus_entidad
BEFORE INSERT OR UPDATE ON historico
FOR EACH ROW
EXECUTE FUNCTION validar_estatus_entidad();
*/

-- Trigger para validar el método de pago en ventas online
CREATE OR REPLACE FUNCTION validar_metodo_pago_online()
RETURNS TRIGGER AS $$
DECLARE
    v_tipo_pago tipo_metodo_pago;
BEGIN
    -- Si el pago está asociado a una venta online
    IF NEW.fk_venta_online IS NOT NULL THEN
        
        -- Obtener el tipo de método de pago usado en el pago
        SELECT tipo INTO v_tipo_pago
        FROM metodo_de_pago
        WHERE clave = NEW.fk_metodo_de_pago;

        -- Validar que el tipo de pago sea uno de los permitidos para ventas online
        -- Actualmente, la simulación usa 'Tarjeta de credito'.
        IF v_tipo_pago <> 'Tarjeta de credito' THEN
            RAISE EXCEPTION 'El método de pago para ventas online debe ser Tarjeta de crédito. Se intentó usar: %', v_tipo_pago;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_validar_metodo_pago_online ON pago;
CREATE TRIGGER tr_validar_metodo_pago_online
BEFORE INSERT ON pago
FOR EACH ROW
EXECUTE FUNCTION validar_metodo_pago_online();


-- Trigger para validar la jerarquía de eventos
CREATE OR REPLACE FUNCTION validar_jerarquia_eventos()
RETURNS TRIGGER AS $$
DECLARE
    lugar_padre_id INT;
BEGIN
    -- Obtener el lugar padre del evento
    SELECT fk_lugar INTO lugar_padre_id
    FROM lugar
    WHERE clave = NEW.fk_lugar;

    -- Si el evento tiene un padre, asegurarse de que no se esté asignando a sí mismo o a un sub-evento
    IF NEW.fk_evento IS NOT NULL THEN
        IF NEW.fk_evento = NEW.clave THEN
            RAISE EXCEPTION 'Un evento no puede ser sub-evento de sí mismo';
        END IF;

        IF EXISTS (
            SELECT 1
            FROM evento
            WHERE clave = NEW.fk_evento
            AND fk_lugar <> lugar_padre_id
        ) THEN
            RAISE EXCEPTION 'El lugar de un sub-evento debe coincidir con el lugar del evento padre';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el campo fecha_fin de la tasa de cambio anterior
CREATE OR REPLACE FUNCTION actualizar_tasa_cambio_anterior()
RETURNS TRIGGER AS
$$
BEGIN
    -- Actualizar la fecha_fin de la tasa anterior activa para la misma moneda
    UPDATE tasa_cambio
    SET fecha_fin = NEW.fecha_inicio - INTERVAL '1 day'
    WHERE fk_moneda = NEW.fk_moneda
      AND fecha_fin IS NULL
      AND clave <> NEW.clave;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

COMMENT ON FUNCTION actualizar_tasa_cambio_anterior IS 'Función del trigger para cerrar la vigencia de una tasa de cambio anterior al insertar una nueva para la misma moneda.';

DROP TRIGGER IF EXISTS trg_actualizar_tasa_anterior ON tasa_cambio;
CREATE TRIGGER trg_actualizar_tasa_anterior
    BEFORE INSERT
    ON tasa_cambio
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_tasa_cambio_anterior();

COMMENT ON TRIGGER trg_actualizar_tasa_anterior ON tasa_cambio IS 'Trigger que se activa antes de insertar una nueva tasa para actualizar la fecha de fin de la tasa anterior activa.';

-- =================================================================
-- TRIGGER PARA ACTUALIZAR INVENTARIO DE ALMACÉN TRAS VENTA ONLINE
-- =================================================================
-- Este trigger se encarga de descontar la cantidad de un producto
-- del almacén principal cada vez que se agrega un item a una
-- venta online (detalle_venta_online).

CREATE OR REPLACE FUNCTION descontar_inventario_almacen_por_venta()
RETURNS TRIGGER AS $$
DECLARE
    stock_actual INT;
BEGIN
    -- Obtener el stock actual del producto en el almacén
    SELECT cantidad_unidades INTO stock_actual
    FROM almacen
    WHERE clave = NEW.fk_almacen;

    -- Verificar si hay suficiente stock
    IF stock_actual IS NULL THEN
        RAISE EXCEPTION 'El producto con ID de almacén % no existe.', NEW.fk_almacen;
    END IF;

    IF stock_actual < NEW.cantidad THEN
        RAISE EXCEPTION 'No hay suficiente stock para el producto con ID de almacén %. Stock disponible: %, Cantidad solicitada: %', NEW.fk_almacen, stock_actual, NEW.cantidad;
    END IF;

    -- Actualizar el inventario del almacén
    UPDATE almacen
    SET cantidad_unidades = cantidad_unidades - NEW.cantidad
    WHERE clave = NEW.fk_almacen;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger que se ejecuta DESPUÉS de insertar un detalle de venta online
DROP TRIGGER IF EXISTS tr_descontar_stock_venta_online ON detalle_venta_online;
CREATE TRIGGER tr_descontar_stock_venta_online
AFTER INSERT ON detalle_venta_online
FOR EACH ROW
EXECUTE FUNCTION descontar_inventario_almacen_por_venta();
