CREATE OR REPLACE PROCEDURE crear_venta_online(
    IN p_usuario_id INT,
    IN p_direccion_envio TEXT,
    IN p_lugar_id INT,
    IN p_items JSON, -- Un array JSON de items: [{"producto_id": 1, "cantidad": 2, "precio": 10.50}]
    IN p_pagos JSON -- Un array JSON de métodos de pago: [{"metodo_id": 1, "monto": 50.00, "tasa_id": 1}]
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_monto_total DECIMAL(10, 2) := 0;
    v_item RECORD;
    v_pago RECORD;
    v_stock_actual INT;
    v_nueva_venta_id INT;
    v_total_pagado DECIMAL(10,2) := 0;
BEGIN
    -- Calcular el monto total y verificar stock
    FOR v_item IN SELECT * FROM json_to_recordset(p_items) AS x(producto_id INT, cantidad INT, precio DECIMAL(10, 2))
    LOOP
        SELECT cantidad INTO v_stock_actual FROM inventario_tienda WHERE clave = v_item.producto_id;
        IF v_stock_actual IS NULL OR v_stock_actual < v_item.cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente para el producto ID %', v_item.producto_id;
        END IF;
        v_monto_total := v_monto_total + (v_item.cantidad * v_item.precio);
    END LOOP;

    -- Sumar los pagos
    FOR v_pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(metodo_id INT, monto DECIMAL(10, 2), tasa_id INT)
    LOOP
        v_total_pagado := v_total_pagado + v_pago.monto;
    END LOOP;

    IF v_total_pagado < v_monto_total THEN
        RAISE EXCEPTION 'Monto pagado (%.2f) es insuficiente para el total de la venta (%.2f).', v_total_pagado, v_monto_total;
    END IF;

    -- Insertar la venta
    INSERT INTO venta_online (fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario)
    VALUES (NOW(), v_monto_total, p_direccion_envio, p_lugar_id, 1, p_usuario_id)
    RETURNING clave INTO v_nueva_venta_id;

    -- Insertar los pagos
    FOR v_pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(metodo_id INT, monto DECIMAL(10, 2), tasa_id INT)
    LOOP
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online)
        VALUES (NOW(), v_pago.monto, v_pago.tasa_id, v_pago.metodo_id, v_nueva_venta_id);
    END LOOP;

    -- Actualizar inventario
    FOR v_item IN SELECT * FROM json_to_recordset(p_items) AS x(producto_id INT, cantidad INT)
    LOOP
        UPDATE inventario_tienda
        SET cantidad = cantidad - v_item.cantidad
        WHERE clave = v_item.producto_id;
    END LOOP;

    -- Crear el primer estado en el historial
    INSERT INTO historico (fecha, fk_estatus, fk_venta_online)
    VALUES (NOW(), 10, v_nueva_venta_id);
END;
$$;

-- Usamos una FUNCTION porque es más fácil obtener el valor de retorno.
CREATE OR REPLACE FUNCTION registrar_cliente_tienda(
    p_rif_ci VARCHAR(20),
    p_primer_nombre VARCHAR(50),
    p_primer_apellido VARCHAR(50),
    p_email VARCHAR(100) DEFAULT NULL,
    p_telefono_codigo INT DEFAULT NULL,
    p_telefono_numero INT DEFAULT NULL
)
RETURNS INT -- Devuelve el ID (clave) del nuevo cliente
LANGUAGE plpgsql
AS $$
DECLARE
    v_nuevo_cliente_id INT;
BEGIN
    -- 1. Validar que el cliente no exista ya
    IF EXISTS (SELECT 1 FROM cliente WHERE rif_ci = p_rif_ci) THEN
        RAISE EXCEPTION 'El cliente con Cédula/RIF % ya existe.', p_rif_ci;
    END IF;

    -- 2. Insertar en la tabla principal de cliente
    -- Asumo que la tabla cliente tiene estos campos. Ajustar si es necesario.
    INSERT INTO cliente (rif_ci, primer_nombre, primer_apellido, email, puntos)
    VALUES (p_rif_ci, p_primer_nombre, p_primer_apellido, p_email, 0)
    RETURNING clave INTO v_nuevo_cliente_id;

    -- 3. Si se proporcionó un teléfono, insertarlo
    IF p_telefono_codigo IS NOT NULL AND p_telefono_numero IS NOT NULL THEN
        INSERT INTO telefono (codigo, numero, fk_cliente)
        VALUES (p_telefono_codigo, p_telefono_numero, v_nuevo_cliente_id);
    END IF;

    -- 4. Devolver el ID del nuevo cliente
    RETURN v_nuevo_cliente_id;
END;
$$;

-- Este SP es el corazón de la venta en tienda.
CREATE OR REPLACE FUNCTION finalizar_venta_fisica(
    p_cliente_id INT,
    p_tienda_fisica_id INT,
    -- Un array JSON con los productos del carrito
    p_items JSON, -- Formato: [{"producto_id": 1, "cantidad": 2, "precio": 15.75}]
    -- Un array JSON con los pagos realizados
    p_pagos JSON -- Formato: [{"metodo_id": 1, "monto": 50.00, "tasa_id": 1}]
)
RETURNS INT -- Devuelve el ID de la nueva venta física
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_venta DECIMAL(10, 2) := 0;
    v_total_pagado DECIMAL(10, 2) := 0;
    v_total_puntos INT := 0;
    v_nueva_venta_id INT;
    v_item RECORD;
    v_pago RECORD;
    v_stock_actual INT;
BEGIN
    -- PASO 1: Calcular totales y validar montos
    FOR v_item IN SELECT * FROM json_to_recordset(p_items) AS x(producto_id INT, cantidad INT, precio DECIMAL(10, 2))
    LOOP
        v_total_venta := v_total_venta + (v_item.cantidad * v_item.precio);
        v_total_puntos := v_total_puntos + v_item.cantidad; -- Un punto por producto
    END LOOP;

    FOR v_pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(monto DECIMAL(10, 2))
    LOOP
        v_total_pagado := v_total_pagado + v_pago.monto;
    END LOOP;

    IF v_total_pagado < v_total_venta THEN
        RAISE EXCEPTION 'Monto pagado (%.2f) es insuficiente para el total de la venta (%.2f).', v_total_pagado, v_total_venta;
    END IF;

    -- PASO 2: Crear el registro de la venta
    INSERT INTO venta_tienda_fisica (fecha, total_venta, fk_tienda_fisica, fk_cliente)
    VALUES (NOW(), v_total_venta, p_tienda_fisica_id, p_cliente_id)
    RETURNING clave INTO v_nueva_venta_id;

    -- PASO 3: Procesar cada item del carrito (inventario y detalle)
    FOR v_item IN SELECT * FROM json_to_recordset(p_items) AS x(producto_id INT, cantidad INT, precio DECIMAL(10, 2))
    LOOP
        -- Validar stock ANTES de descontar
        SELECT cantidad INTO v_stock_actual FROM inventario_tienda WHERE fk_producto = v_item.producto_id AND fk_tienda_fisica = p_tienda_fisica_id;
        IF v_stock_actual IS NULL OR v_stock_actual < v_item.cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente para el producto ID %. Solo quedan % unidades.', v_item.producto_id, v_stock_actual;
        END IF;

        -- Descontar del inventario
        UPDATE inventario_tienda
        SET cantidad = cantidad - v_item.cantidad
        WHERE fk_producto = v_item.producto_id AND fk_tienda_fisica = p_tienda_fisica_id;
        
        -- Insertar en una tabla de detalle de venta (si la tienes)
        -- INSERT INTO detalle_venta_fisica(fk_venta, fk_producto, cantidad, precio_unitario) VALUES ...
    END LOOP;

    -- PASO 4: Registrar los pagos
    FOR v_pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(metodo_id INT, monto DECIMAL(10, 2), tasa_id INT)
    LOOP
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica)
        VALUES (NOW(), v_pago.monto, v_pago.tasa_id, v_pago.metodo_id, v_nueva_venta_id);
    END LOOP;

    -- PASO 5: Asignar los puntos al cliente
    UPDATE cliente SET puntos = puntos + v_total_puntos WHERE clave = p_cliente_id;

    RETURN v_nueva_venta_id;
END;
$$;