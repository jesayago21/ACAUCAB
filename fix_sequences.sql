-- =================================================================
-- SCRIPT PARA RESINCRONIZAR SECUENCIAS
-- =================================================================
-- Este script resincroniza los contadores de las claves primarias
-- (secuencias) con los datos existentes en las tablas.
--
-- Ejecútalo UNA VEZ para solucionar errores de "llave duplicada" 
-- al insertar nuevos registros en tablas que usan claves SERIAL.
-- =================================================================

DO $$
BEGIN
    RAISE NOTICE '--- Iniciando Sincronización de Secuencias ---';

    -- Sincronizar tabla 'rol'
    PERFORM setval(pg_get_serial_sequence('rol', 'clave'), COALESCE(MAX(clave), 1)) FROM rol;
    RAISE NOTICE 'Secuencia de "rol" sincronizada.';

    -- Sincronizar tabla 'cliente'
    PERFORM setval(pg_get_serial_sequence('cliente', 'clave'), COALESCE(MAX(clave), 1)) FROM cliente;
    RAISE NOTICE 'Secuencia de "cliente" sincronizada.';

    -- Sincronizar tabla 'usuario'
    PERFORM setval(pg_get_serial_sequence('usuario', 'clave'), COALESCE(MAX(clave), 1)) FROM usuario;
    RAISE NOTICE 'Secuencia de "usuario" sincronizada.';

    -- Sincronizar tabla 'metodo_de_pago'
    PERFORM setval(pg_get_serial_sequence('metodo_de_pago', 'clave'), COALESCE(MAX(clave), 1)) FROM metodo_de_pago;
    RAISE NOTICE 'Secuencia de "metodo_de_pago" sincronizada.';

    -- Sincronizar tablas de la transacción de venta
    PERFORM setval(pg_get_serial_sequence('venta_online', 'clave'), COALESCE(MAX(clave), 1)) FROM venta_online;
    RAISE NOTICE 'Secuencia de "venta_online" sincronizada.';

    PERFORM setval(pg_get_serial_sequence('pago', 'clave'), COALESCE(MAX(clave), 1)) FROM pago;
    RAISE NOTICE 'Secuencia de "pago" sincronizada.';

    PERFORM setval(pg_get_serial_sequence('historico', 'clave'), COALESCE(MAX(clave), 1)) FROM historico;
    RAISE NOTICE 'Secuencia de "historico" sincronizada.';

    RAISE NOTICE '--- Sincronización de secuencias completada. ---';
END $$; 