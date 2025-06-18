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
    ORDER BY h.fecha_inicio DESC
    LIMIT 1;

    -- Si encontramos un estado 'procesando' y el nuevo es 'listo para entrega'
    IF estado_anterior IS NOT NULL AND 
       (SELECT estado FROM estatus WHERE clave = NEW.fk_estatus) = 'listo para entrega' AND
       (NEW.fecha_inicio - estado_anterior.fecha_inicio) > INTERVAL '2 hours' THEN
        RAISE EXCEPTION 'No pueden pasar más de dos horas entre el estado procesando y listo para entrega';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
        INSERT INTO historico (fecha_inicio, fk_estatus, fk_compra)
        VALUES (CURRENT_DATE, 
               (SELECT clave FROM estatus WHERE estado = 'procesando' AND aplicable_a = 'compra' LIMIT 1),
               v_compra_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_generar_orden_compra_automatica
AFTER UPDATE ON almacen
FOR EACH ROW
EXECUTE FUNCTION generar_orden_compra_automatica();

-- Trigger para validar que solo el jefe de compras pueda cambiar el estatus de una orden de compra
CREATE OR REPLACE FUNCTION validar_cambio_estatus_compra()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si el usuario actual tiene el rol de jefe de compras
    IF NEW.fk_compra IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM usuario u
        JOIN rol r ON r.clave = u.fk_rol
        WHERE u.clave = CURRENT_USER::integer  -- Asumiendo que tienes una función que retorna el usuario actual
        AND r.nombre = 'Jefe de Compras'
    ) THEN
        RAISE EXCEPTION 'Solo el jefe de compras puede cambiar el estatus de una orden de compra';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_validar_cambio_estatus_compra
BEFORE INSERT OR UPDATE ON historico
FOR EACH ROW
EXECUTE FUNCTION validar_cambio_estatus_compra();

-- Trigger para validar el pago de orden de compra
CREATE OR REPLACE FUNCTION validar_pago_compra()
RETURNS TRIGGER AS $$
DECLARE
    fecha_entregado DATE;
BEGIN
    -- Obtener la fecha cuando se marcó como entregado
    SELECT h.fecha_inicio INTO fecha_entregado
    FROM historico h
    JOIN estatus e ON e.clave = h.fk_estatus
    WHERE h.fk_compra = NEW.fk_compra
    AND e.estado = 'entregado'
    AND e.aplicable_a = 'compra'
    ORDER BY h.fecha_inicio DESC
    LIMIT 1;

    -- Verificar que hayan pasado 15 días desde la entrega
    IF fecha_entregado IS NOT NULL AND 
       NEW.fecha_pago < (fecha_entregado + INTERVAL '15 days') THEN
        RAISE EXCEPTION 'El pago debe realizarse 15 días después de la entrega';
    END IF;

    -- Verificar que el método de pago sea en efectivo
    IF NOT EXISTS (
        SELECT 1 FROM metodo_de_pago
        WHERE clave = NEW.fk_metodo_de_pago
        AND tipo = 'Efectivo'
    ) THEN
        RAISE EXCEPTION 'El pago de una orden de compra debe ser en efectivo';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_validar_pago_compra
BEFORE INSERT ON pago
FOR EACH ROW
WHEN (NEW.fk_compra IS NOT NULL)
EXECUTE FUNCTION validar_pago_compra();

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
        
        IF v_almacen_id IS NULL OR v_usuario_id IS NULL THEN
            RAISE EXCEPTION 'No se encontró el almacén o usuario correspondiente para la reposición';
        END IF;
        
        -- Crear nueva reposición
        INSERT INTO reposicion (fk_almacen, fk_inventario_tienda, fk_usuario, cantidad, fecha)
        VALUES (v_almacen_id, NEW.clave, v_usuario_id, 100, CURRENT_DATE);  -- La cantidad a reponer debería definirse según la lógica de negocio
        
        -- Insertar el primer estado en histórico
        INSERT INTO historico (fecha_inicio, fk_estatus, fk_reposicion)
        VALUES (CURRENT_DATE, 
               (SELECT clave FROM estatus WHERE estado = 'procesando' AND aplicable_a = 'reposicion' LIMIT 1),
               currval('reposicion_clave_seq'));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_generar_orden_reposicion
AFTER UPDATE ON inventario_tienda
FOR EACH ROW
EXECUTE FUNCTION generar_orden_reposicion();

-- Trigger para validar que los estatus correspondan con el tipo de entidad
CREATE OR REPLACE FUNCTION validar_estatus_entidad()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar estatus de cuota
    IF NEW.fk_cuota IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM estatus 
        WHERE clave = NEW.fk_estatus 
        AND aplicable_a = 'cuota'
        AND estado IN ('pagado', 'por pagar', 'vencido')
    ) THEN
        RAISE EXCEPTION 'Estado no válido para cuota. Estados permitidos: pagado, por pagar, vencido';
    END IF;

    -- Validar estatus de compra, reposición y venta online
    IF (NEW.fk_compra IS NOT NULL OR NEW.fk_reposicion IS NOT NULL OR NEW.fk_venta_online IS NOT NULL) 
    AND NOT EXISTS (
        SELECT 1 FROM estatus 
        WHERE clave = NEW.fk_estatus 
        AND estado IN ('procesando', 'listo para entrega', 'entregado')
        AND (
            (NEW.fk_compra IS NOT NULL AND aplicable_a = 'compra') OR
            (NEW.fk_reposicion IS NOT NULL AND aplicable_a = 'reposicion') OR
            (NEW.fk_venta_online IS NOT NULL AND aplicable_a = 'venta online')
        )
    ) THEN
        RAISE EXCEPTION 'Estado no válido para la entidad. Estados permitidos: procesando, listo para entrega, entregado';
    END IF;

    -- Validar que solo se asigne un tipo de entidad
    IF (CASE WHEN NEW.fk_compra IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN NEW.fk_reposicion IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN NEW.fk_venta_online IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN NEW.fk_cuota IS NOT NULL THEN 1 ELSE 0 END) != 1 THEN
        RAISE EXCEPTION 'Debe asignarse exactamente una entidad al histórico';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_validar_estatus_entidad
BEFORE INSERT OR UPDATE ON historico
FOR EACH ROW
EXECUTE FUNCTION validar_estatus_entidad();

-- Trigger para validar método de pago en ventas online
CREATE OR REPLACE FUNCTION validar_metodo_pago_online()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar que el método de pago sea tarjeta de crédito para ventas online
    IF NEW.fk_venta_online IS NOT NULL AND NOT EXISTS (
        SELECT 1 
        FROM metodo_de_pago 
        WHERE clave = NEW.fk_metodo_de_pago 
        AND tipo = 'Tarjeta de credito'
    ) THEN
        RAISE EXCEPTION 'Las ventas online solo pueden pagarse con tarjeta de crédito';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_validar_metodo_pago_online
BEFORE INSERT ON pago
FOR EACH ROW
EXECUTE FUNCTION validar_metodo_pago_online();

-- Trigger para validar jerarquía de eventos
CREATE OR REPLACE FUNCTION validar_jerarquia_eventos()
RETURNS TRIGGER AS $$
DECLARE
    evento_padre_tipo VARCHAR;
    nivel_recursion INT;
BEGIN
    -- Si es un sub-evento (tiene evento padre)
    IF NEW.fk_evento IS NOT NULL THEN
        -- Obtener el tipo del evento padre
        SELECT te.nombre INTO evento_padre_tipo
        FROM evento e
        JOIN tipo_evento te ON te.clave = e.fk_tipo_evento
        WHERE e.clave = NEW.fk_evento;
        
        -- Verificar que el evento padre no sea ya un sub-evento
        SELECT COUNT(*) INTO nivel_recursion
        FROM evento
        WHERE clave = NEW.fk_evento
        AND fk_evento IS NOT NULL;
        
        -- Si el padre ya es un sub-evento, no permitir la inserción
        IF nivel_recursion > 0 THEN
            RAISE EXCEPTION 'No se permiten más de un nivel de sub-eventos';
        END IF;
        
        -- Verificar que el tipo de sub-evento sea válido
        IF NOT EXISTS (
            SELECT 1
            FROM tipo_evento te
            WHERE te.clave = NEW.fk_tipo_evento
            AND te.nombre IN ('ponencia', 'taller')
        ) THEN
            RAISE EXCEPTION 'Los sub-eventos solo pueden ser de tipo ponencia o taller';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_validar_jerarquia_eventos
BEFORE INSERT OR UPDATE ON evento
FOR EACH ROW
EXECUTE FUNCTION validar_jerarquia_eventos(); 