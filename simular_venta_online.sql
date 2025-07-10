
-- =================================================================
-- SCRIPT PARA SIMULAR UNA VENTA ONLINE Y PROBAR TRIGGERS
-- =================================================================
-- Este script realiza una venta online completa para verificar
-- que el trigger 'tr_descontar_stock_venta_online' funciona.
-- Versión 2: No usa claves primarias explícitas y busca o crea
-- los datos necesarios para ser re-ejecutable.

DO $$
DECLARE
    -- IDs a utilizar
    v_cliente_id INT;
    v_usuario_id INT;
    v_rol_id INT;
    v_metodo_pago_tarjeta_id INT;
    v_tasa_cambio_id INT;
    v_estatus_procesando_id INT := 7; -- 'procesando' para 'venta online'
    v_tienda_online_id INT := 1;
    v_lugar_id INT := 1013; -- Un lugar de ejemplo para la dirección

    -- Producto a comprar (ajusta estos valores a un producto con stock)
    v_almacen_id_producto INT := 1; -- ID del producto en la tabla 'almacen'
    v_cantidad_a_comprar INT := 5;
    v_precio_unitario NUMERIC := 12.50;
    
    -- Variables para la venta
    v_venta_online_id INT;
    v_monto_total NUMERIC;
    v_stock_antes INT;
    v_stock_despues INT;
BEGIN
    -- =================================================================
    -- PASO 1: OBTENER O CREAR DATOS MÍNIMOS REQUERIDOS
    -- Se busca primero si el dato existe, y si no, se crea.
    -- =================================================================

    -- Obtener o crear el Rol de Cliente
    RAISE NOTICE '--- Preparando datos de prueba ---';
    SELECT clave INTO v_rol_id FROM rol WHERE nombre = 'Cliente Online' LIMIT 1;
    IF NOT FOUND THEN
        INSERT INTO rol (nombre) 
        VALUES ('Cliente Online')
        RETURNING clave INTO v_rol_id;
        RAISE NOTICE 'Rol "Cliente Online" creado con ID: %', v_rol_id;
    ELSE
        RAISE NOTICE 'Rol "Cliente Online" encontrado con ID: %', v_rol_id;
    END IF;

    -- Obtener o crear el Cliente de prueba
    SELECT clave INTO v_cliente_id FROM cliente WHERE rif = 999999999 LIMIT 1;
    IF NOT FOUND THEN
        -- Para un cliente 'natural', necesitamos RIF, CI y una dirección.
        INSERT INTO cliente (rif, tipo, ci, primer_nombre, primer_apellido, puntos_acumulados, direccion_habitacion, fk_direccion_habitacion)
        VALUES (999999999, 'natural', 99999999, 'Usuario', 'Prueba', 0, 'Direccion de prueba', v_lugar_id)
        RETURNING clave INTO v_cliente_id;
        RAISE NOTICE 'Cliente "Usuario Prueba" creado con ID: % y RIF 999999999', v_cliente_id;
    ELSE
        RAISE NOTICE 'Cliente "Usuario Prueba" encontrado con ID: %', v_cliente_id;
    END IF;

    -- Obtener o crear el Usuario de prueba
    SELECT clave INTO v_usuario_id FROM usuario WHERE username = 'usuarioprueba' LIMIT 1;
    IF NOT FOUND THEN
        INSERT INTO usuario (username, contrasena, fk_rol, fk_cliente)
        VALUES ('usuarioprueba', '1234', v_rol_id, v_cliente_id)
        RETURNING clave INTO v_usuario_id;
        RAISE NOTICE 'Usuario "usuarioprueba" creado con ID: %', v_usuario_id;
    ELSE
        RAISE NOTICE 'Usuario "usuarioprueba" encontrado con ID: %', v_usuario_id;
    END IF;
    
    -- Obtener o crear un método de pago válido para la venta online
    -- Usaremos 'Tarjeta de credito' que es un tipo válido.
    -- El trigger de la BD valida que solo Zelle (u otro método electrónico) sea usado
    -- por lo que crearemos una entrada genérica que cumpla la estructura.
    SELECT clave INTO v_metodo_pago_tarjeta_id FROM metodo_de_pago WHERE tipo = 'Tarjeta de credito' AND fk_cliente = v_cliente_id LIMIT 1;
    IF NOT FOUND THEN
        INSERT INTO metodo_de_pago (tipo, fk_cliente, numero_tarjeta, fecha_vencimiento, banco)
        VALUES ('Tarjeta de credito', v_cliente_id, 1111222233334444, '2029-12-31', 'Banco de Prueba')
        RETURNING clave INTO v_metodo_pago_tarjeta_id;
        RAISE NOTICE 'Metodo de pago "Tarjeta de credito" de prueba creado con ID: %', v_metodo_pago_tarjeta_id;
    ELSE
        RAISE NOTICE 'Metodo de pago "Tarjeta de credito" de prueba encontrado con ID: %', v_metodo_pago_tarjeta_id;
    END IF;
    
    -- Obtener una tasa de cambio activa (p. ej. para USD)
    SELECT clave INTO v_tasa_cambio_id 
    FROM tasa_cambio 
    WHERE fecha_fin IS NULL AND moneda = 'USD'
    ORDER BY fecha_inicio DESC 
    LIMIT 1;
    
    IF NOT FOUND THEN
        -- Si no hay tasa activa para USD, crea una de prueba.
        RAISE NOTICE 'No se encontró tasa de cambio activa para USD, creando una de prueba...';
        INSERT INTO tasa_cambio (moneda, monto_equivalencia, fecha_inicio)
        VALUES ('USD', 40.0, CURRENT_DATE)
        RETURNING clave INTO v_tasa_cambio_id;
    END IF;
    RAISE NOTICE 'Usando tasa de cambio con ID: %', v_tasa_cambio_id;

    -- =================================================================
    -- PASO 2: VERIFICAR STOCK ANTES DE LA VENTA
    -- =================================================================
    
    RAISE NOTICE '--- Verificando Stock ---';
    SELECT cantidad_unidades INTO v_stock_antes FROM almacen WHERE clave = v_almacen_id_producto;
    RAISE NOTICE 'Stock del producto (ID: %) ANTES de la venta: %', v_almacen_id_producto, v_stock_antes;

    IF v_stock_antes IS NULL THEN
        RAISE EXCEPTION 'El producto con ID de almacén % no existe. Por favor, verifica la variable v_almacen_id_producto.', v_almacen_id_producto;
    END IF;

    IF v_stock_antes < v_cantidad_a_comprar THEN
        RAISE EXCEPTION 'No hay suficiente stock para realizar la prueba. Stock disponible: %, Cantidad requerida: %', v_stock_antes, v_cantidad_a_comprar;
    END IF;

    -- =================================================================
    -- PASO 3: EJECUTAR LA TRANSACCIÓN DE VENTA ONLINE
    -- =================================================================
    
    RAISE NOTICE '--- Iniciando Transacción de Venta Online ---';

    -- Calcular monto total
    v_monto_total := v_cantidad_a_comprar * v_precio_unitario;

    -- 1. Insertar la cabecera de la venta online
    INSERT INTO venta_online (fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario)
    VALUES (CURRENT_DATE, v_monto_total, 'Direccion de prueba, Caracas', v_lugar_id, v_tienda_online_id, v_usuario_id)
    RETURNING clave INTO v_venta_online_id;
    
    RAISE NOTICE 'Venta online creada con ID: %', v_venta_online_id;

    -- 2. Insertar el detalle de la venta (ESTO DISPARA EL TRIGGER)
    INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
    VALUES (v_venta_online_id, v_almacen_id_producto, v_cantidad_a_comprar, v_precio_unitario);
    
    RAISE NOTICE 'Detalle de venta insertado. El trigger de descuento de stock se ha ejecutado.';

    -- 3. Insertar el pago asociado (usando Tarjeta de credito para cumplir la restricción)
    INSERT INTO pago (fecha_pago, monto_total, fk_metodo_de_pago, fk_venta_online, fk_tasa_cambio)
    VALUES (CURRENT_DATE, v_monto_total, v_metodo_pago_tarjeta_id, v_venta_online_id, v_tasa_cambio_id);
    
    RAISE NOTICE 'Pago con Tarjeta de credito registrado para la venta.';

    -- 4. Insertar el estado inicial en el histórico
    INSERT INTO historico (fecha, fk_estatus, fk_venta_online)
    VALUES (NOW(), v_estatus_procesando_id, v_venta_online_id);

    RAISE NOTICE 'Estado inicial "procesando" registrado en el histórico.';
    
    -- =================================================================
    -- PASO 4: VERIFICAR STOCK DESPUÉS DE LA VENTA
    -- =================================================================

    SELECT cantidad_unidades INTO v_stock_despues FROM almacen WHERE clave = v_almacen_id_producto;
    RAISE NOTICE '--- Verificación Final ---';
    RAISE NOTICE 'Stock del producto (ID: %) DESPUÉS de la venta: %', v_almacen_id_producto, v_stock_despues;

    IF v_stock_antes - v_cantidad_a_comprar = v_stock_despues THEN
        RAISE NOTICE '¡ÉXITO! El stock se ha descontado correctamente.';
    ELSE
        RAISE NOTICE '¡FALLO! El stock no se descontó como se esperaba.';
    END IF;

END $$; 