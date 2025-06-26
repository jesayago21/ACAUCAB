/* Tablas creadas, cheqquear en:

https://www.canva.com/design/DAGqE0e9XEM/PXLuCVMecbLF0AXxoVMUxw/edit?utm_content=DAGqE0e9XEM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

*/



CREATE type tipo_moneda AS ENUM (

'USD',

'EUR',

'VES',

'PUNTOS'

);



CREATE type tipo_metodo_pago AS ENUM (

'Efectivo',

'Cheque',

'Tarjeta de credito',

'Tarjeta de debito',

'Puntos'

);



CREATE TYPE tipo_cliente AS ENUM ('natural', 'juridico');

CREATE TABLE IF NOT EXISTS receta (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT pk_receta PRIMARY KEY (clave)
    
);

CREATE TABLE IF NOT EXISTS tipo_cerveza (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT,
    historia TEXT,
    fk_tipo_cerveza INT,
    fk_receta INT,--opcional para las que estan as arriba en la relacion no necesiten una receta
    CONSTRAINT pk_tipo_cerveza PRIMARY KEY (clave),
    CONSTRAINT fk_tipo_cerveza_tipo_cerveza FOREIGN KEY (fk_tipo_cerveza) REFERENCES tipo_cerveza(clave),
    CONSTRAINT fk_receta_tipo_cerveza FOREIGN KEY (fk_receta) REFERENCES receta(clave)
   -- CONSTRAINT uq_tipo_cerveza UNIQUE (fk_receta)
);

CREATE TABLE IF NOT EXISTS caracteristica (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    CONSTRAINT pk_caracteristica PRIMARY KEY (clave)
);

CREATE TABLE IF NOT EXISTS tipo_evento (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT pk_tipo_evento PRIMARY KEY (clave)
);

CREATE TABLE IF NOT EXISTS ingrediente (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT pk_ingrediente PRIMARY KEY (clave)
);

CREATE TABLE IF NOT EXISTS cargo (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT pk_cargo PRIMARY KEY (clave)
);

CREATE TABLE IF NOT EXISTS rol (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    CONSTRAINT pk_rol PRIMARY KEY (clave)
);

CREATE TABLE IF NOT EXISTS privilegio (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_privilegio PRIMARY KEY (clave)
);

CREATE TABLE IF NOT EXISTS tipo_beneficio (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_tipo_beneficio PRIMARY KEY (clave)
);

CREATE TABLE IF NOT EXISTS tipo_invitado (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    CONSTRAINT pk_tipo_invitado PRIMARY KEY (clave)
);

CREATE TABLE IF NOT EXISTS lugar (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    fk_lugar INT,
    CONSTRAINT pk_lugar PRIMARY KEY (clave),
    CONSTRAINT fk_lugar_lugar FOREIGN KEY (fk_lugar) REFERENCES lugar(clave),
    CONSTRAINT chk_tipo_lugar CHECK (tipo IN ('estado', 'municipio', 'parroquia'))
);

CREATE TABLE IF NOT EXISTS estatus (   --REVISAR LOS ESTADOS DEL ESTATUS Y EL COÑAZO DE CHECKS
    clave SERIAL,
    estado VARCHAR(50) NOT NULL,
    aplicable_a VARCHAR(50) NOT NULL,
    CONSTRAINT pk_estatus PRIMARY KEY (clave),
    CONSTRAINT chk_aplicable_a_estatus CHECK (aplicable_a IN ('compra', 'cuota', 'reposicion', 'venta online')) 
);

CREATE TABLE IF NOT EXISTS lugar_tienda (
    clave SERIAL,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    fk_lugar_tienda INT,
    CONSTRAINT pk_lugar_tienda PRIMARY KEY (clave),
    CONSTRAINT fk_lugar_tienda_lugar_tienda FOREIGN KEY (fk_lugar_tienda) REFERENCES lugar_tienda(clave),
    CONSTRAINT chk_tipo_lugar_tienda CHECK (tipo IN ('zona', 'pasillo', 'anaquel'))
);

CREATE TABLE IF NOT EXISTS tasa_cambio (
    clave SERIAL,
    moneda tipo_moneda NOT NULL,
    monto_equivalencia DECIMAL(10,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    CONSTRAINT pk_tasa_cambio PRIMARY KEY (clave),
    CONSTRAINT chk_monto_equivalencia CHECK (monto_equivalencia > 0),
    CONSTRAINT chk_fechas_tasa_cambio CHECK (fecha_fin IS NULL OR fecha_inicio <= fecha_fin)
);

CREATE TABLE IF NOT EXISTS cliente (
    clave SERIAL,
    rif INT NOT NULL,
    puntos_acumulados INT NOT NULL DEFAULT 0,
    tipo tipo_cliente NOT NULL,
    -- NATURAL
    ci INT,
    primer_nombre VARCHAR(50),
    segundo_nombre VARCHAR(50),
    primer_apellido VARCHAR(50),
    segundo_apellido VARCHAR(50),
    direccion_habitacion VARCHAR(255),
    fk_direccion_habitacion INT,
    -- JURIDICA
    razon_social VARCHAR(50),
    denominacion_comercial VARCHAR(50),
    url_pagina_web VARCHAR(100),
    capital_disponible INT,
    direccion_fiscal VARCHAR(255),
    direccion_fisica VARCHAR(255),
    fk_direccion_fiscal INT,
    fk_direccion_fisica INT,

    CONSTRAINT pk_cliente PRIMARY KEY (clave),
    CONSTRAINT fk_direccion_habitacion_cliente FOREIGN KEY (fk_direccion_habitacion) REFERENCES lugar(clave),
    CONSTRAINT fk_direccion_fiscal_cliente FOREIGN KEY (fk_direccion_fiscal) REFERENCES lugar(clave),
    CONSTRAINT fk_direccion_fisica_cliente FOREIGN KEY (fk_direccion_fisica) REFERENCES lugar(clave),
    CONSTRAINT unq_rif_cliente UNIQUE (rif),
    CONSTRAINT chk_rif CHECK (rif BETWEEN 1000000 AND 999999999), -- RIF venezolano válido
    CONSTRAINT chk_puntos_acumulados CHECK (puntos_acumulados >= 0),
    CONSTRAINT chk_capital_disponible CHECK (capital_disponible IS NULL OR capital_disponible >= 0),
    CONSTRAINT chk_url_pagina_web CHECK (
        (tipo = 'juridico' AND url_pagina_web LIKE 'http%://%') OR 
        (tipo = 'natural' AND url_pagina_web IS NULL)
    ),
    
    -- Validación mejorada por tipo
    CONSTRAINT chk_tipo_cliente CHECK (
        (tipo = 'natural' AND 
         ci IS NOT NULL AND 
         primer_nombre IS NOT NULL AND 
         primer_apellido IS NOT NULL AND 
         direccion_habitacion IS NOT NULL AND 
         fk_direccion_habitacion IS NOT NULL AND
         razon_social IS NULL AND 
         denominacion_comercial IS NULL AND 
         capital_disponible IS NULL AND 
         direccion_fiscal IS NULL AND 
         direccion_fisica IS NULL AND 
         fk_direccion_fiscal IS NULL AND 
         fk_direccion_fisica IS NULL)
        OR
        (tipo = 'juridico' AND 
         razon_social IS NOT NULL AND 
         denominacion_comercial IS NOT NULL AND 
         url_pagina_web IS NOT NULL AND 
         capital_disponible IS NOT NULL AND 
         direccion_fiscal IS NOT NULL AND 
         direccion_fisica IS NOT NULL AND 
         fk_direccion_fiscal IS NOT NULL AND 
         fk_direccion_fisica IS NOT NULL AND
         ci IS NULL AND 
         primer_nombre IS NULL AND 
         segundo_nombre IS NULL AND 
         primer_apellido IS NULL AND 
         segundo_apellido IS NULL AND 
         direccion_habitacion IS NULL AND 
         fk_direccion_habitacion IS NULL)
    )
);

CREATE TABLE IF NOT EXISTS empleado (
    ci INT NOT NULL,
    primer_nombre VARCHAR (50) NOT NULL,
    segundo_nombre VARCHAR (50),
    primer_apellido VARCHAR (50) NOT NULL,
    segundo_apellido VARCHAR (50),
    fecha_nacimiento DATE NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_empleado PRIMARY KEY (ci),
    CONSTRAINT chk_ci CHECK (ci > 0 AND ci < 1000000000)
);

CREATE TABLE IF NOT EXISTS miembro (
    rif INT NOT NULL,
    razon_social VARCHAR (50) NOT NULL,
    denominacion_comercial VARCHAR (50),
    direccion_fiscal VARCHAR (255) NOT NULL,
    direccion_fisica VARCHAR (255) NOT NULL,
    fecha_afiliacion DATE NOT NULL,
    fk_lugar_1 INT NOT NULL,
    fk_lugar_2 INT NOT NULL,
    CONSTRAINT pk_miembro PRIMARY KEY (rif),
    CONSTRAINT fk_lugar_miembro1 FOREIGN KEY (fk_lugar_1) REFERENCES lugar(clave),
    CONSTRAINT fk_lugar_miembro2 FOREIGN KEY (fk_lugar_2) REFERENCES lugar(clave) 
);

CREATE TABLE IF NOT EXISTS usuario (
    clave SERIAL,
    username VARCHAR (50) NOT NULL,
    contrasena VARCHAR (50) NOT NULL,
    fk_rol INT NOT NULL,
    fk_empleado INT,
    fk_miembro INT,
    fk_cliente INT,
    CONSTRAINT pk_usuario PRIMARY KEY (clave),
    CONSTRAINT fk_rol_usuario FOREIGN KEY (fk_rol) REFERENCES rol(clave),
    CONSTRAINT fk_empleado_usuario FOREIGN KEY (fk_empleado) REFERENCES empleado(ci),
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (fk_cliente) REFERENCES cliente(clave),
    CONSTRAINT fk_miembro_usuario FOREIGN KEY (fk_miembro) REFERENCES miembro(rif),
    -- Restricción de Arco (Exclusión Mutua)
    CONSTRAINT arco_usuario CHECK (
        (CASE WHEN fk_empleado IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_miembro IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_cliente IS NOT NULL THEN 1 ELSE 0 END)
        = 1
    )
);

CREATE TABLE IF NOT EXISTS metodo_de_pago (
    clave SERIAL,
    moneda tipo_moneda NOT NULL DEFAULT 'VES',
    fk_cliente INT,
    metodo_preferido BOOLEAN NOT NULL DEFAULT FALSE,
    valor DECIMAL(15,2),
    numero_cheque BIGINT,
    fecha_vencimiento DATE,
    banco VARCHAR(50),
    numero_tarjeta BIGINT,
    tipo tipo_metodo_pago NOT NULL,
    CONSTRAINT pk_metodo_de_pago PRIMARY KEY (clave),
    CONSTRAINT fk_cliente_metodo_de_pago FOREIGN KEY (fk_cliente) REFERENCES cliente(clave),
    CONSTRAINT chk_numero_cheque CHECK (numero_cheque IS NULL OR (numero_cheque > 99999999 and numero_cheque < 1000000000)),
    CONSTRAINT chk_numero_tarjeta CHECK (numero_tarjeta IS NULL OR (numero_tarjeta > 999999999999999 and numero_tarjeta < 10000000000000000)),

    
    CONSTRAINT chk_tipo_metodo_de_pago CHECK (
        (tipo = 'Efectivo' AND
         valor IS NOT NULL AND
         valor > 0 AND
         numero_cheque IS NULL AND
         numero_tarjeta IS NULL AND
         fecha_vencimiento IS NULL AND
         banco IS NULL AND
         metodo_preferido IS FALSE)
        OR
        (tipo = 'Cheque' AND
         numero_cheque IS NOT NULL AND
         banco IS NOT NULL AND
         valor IS NULL AND
         numero_tarjeta IS NULL AND
         fecha_vencimiento IS NULL AND
         metodo_preferido IS FALSE)
        OR
        (tipo IN ('Tarjeta de credito', 'Tarjeta de debito') AND
         numero_tarjeta IS NOT NULL AND
         fecha_vencimiento IS NOT NULL AND
         banco IS NOT NULL AND
         valor IS NULL AND
         numero_cheque IS NULL AND
         fk_cliente IS NOT NULL)    
        OR
        (tipo = 'Puntos' AND
         valor IS NULL AND
         numero_cheque IS NULL AND
         numero_tarjeta IS NULL AND
         fecha_vencimiento IS NULL AND
         banco IS NULL AND
         metodo_preferido IS FALSE)
    )
);

CREATE TABLE IF NOT EXISTS horario (
    clave SERIAL,
    dia VARCHAR(50) NOT NULL,
    fecha_hora_inicio TIME NOT NULL,
    fecha_hora_fin TIME NOT NULL,
    CONSTRAINT pk_horario PRIMARY KEY (clave),
    CONSTRAINT chk_dia CHECK (dia IN ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo')),
    CONSTRAINT chk_fecha_hora_inicio CHECK (fecha_hora_inicio < fecha_hora_fin),
    CONSTRAINT chk_fecha_hora_fin CHECK (fecha_hora_fin > fecha_hora_inicio)
    --CONSTRAINT unq_horario_dia_horas UNIQUE (dia, fecha_hora_inicio, fecha_hora_fin)
);

CREATE TABLE IF NOT EXISTS cerveza (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    grado_alcohol INT NOT NULL,
    fk_tipo_cerveza INT NOT NULL,
    fk_receta INT NOT NULL,
    fk_miembro INT NOT NULL,
    CONSTRAINT pk_cerveza PRIMARY KEY (clave),
    CONSTRAINT fk_tipo_cerveza_cerveza FOREIGN KEY (fk_tipo_cerveza) REFERENCES tipo_cerveza(clave),
    CONSTRAINT fk_receta_cerveza FOREIGN KEY (fk_receta) REFERENCES receta(clave),
    CONSTRAINT fk_miembro_cerveza FOREIGN KEY (fk_miembro) REFERENCES miembro(rif)
);


CREATE TABLE IF NOT EXISTS presentacion (
    clave SERIAL,
    EAN_13 BIGINT NOT NULL,
    nombre VARCHAR (50) NOT NULL,
    cantidad_unidades INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    fk_cerveza INT NOT NULL,
    CONSTRAINT pk_presentacion PRIMARY KEY (clave),
    CONSTRAINT fk_cerveza_presentacion FOREIGN KEY (fk_cerveza) REFERENCES cerveza(clave), 
    CONSTRAINT chk_ean_13 CHECK (EAN_13 > 0 AND EAN_13 < 10000000000000),
    CONSTRAINT chk_cantidad_unidades CHECK (cantidad_unidades > 0)
);

CREATE TABLE IF NOT EXISTS tienda_fisica (
    clave SERIAL,
    nombre VARCHAR(50) NOT NULL,
    direccion TEXT NOT NULL,
    rif_empresa INT NOT NULL,
    fk_lugar INT NOT NULL,
    CONSTRAINT pk_tienda_fisica PRIMARY KEY (clave),
    CONSTRAINT fk_lugar_tienda_fisica FOREIGN KEY (fk_lugar) REFERENCES lugar(clave)
);

CREATE TABLE IF NOT EXISTS departamento (
    clave SERIAL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fk_tienda_fisica INT NOT NULL,
    CONSTRAINT pk_departamento PRIMARY KEY (clave),
    CONSTRAINT fk_tienda_fisica_departamento FOREIGN KEY (fk_tienda_fisica) REFERENCES tienda_fisica(clave)
);

CREATE TABLE IF NOT EXISTS tienda_online (
    clave SERIAL,
    nombre VARCHAR(50),
    url_web VARCHAR(100),
    CONSTRAINT pk_tienda_online PRIMARY KEY (clave),
    CONSTRAINT chk_url_web CHECK (url_web LIKE 'http%://%')
 );

CREATE TABLE IF NOT EXISTS evento (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    direccion TEXT NOT NULL,
    precio_entrada INT,
    fk_evento INT,
    fk_lugar INT NOT NULL,
    fk_tipo_evento INT NOT NULL,
    CONSTRAINT pk_evento PRIMARY KEY (clave),
    CONSTRAINT fk_evento_evento FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT fk_lugar_evento FOREIGN KEY (fk_lugar) REFERENCES lugar(clave),
    CONSTRAINT fk_tipo_evento_evento FOREIGN KEY (fk_tipo_evento) REFERENCES tipo_evento(clave)
);

CREATE TABLE IF NOT EXISTS invitado (
    ci SERIAL,
    rif INT NOT NULL,
    primer_nombre VARCHAR (50) NOT NULL,
    primer_apellido VARCHAR (50) NOT NULL,
    fk_tipo_invitado INT NOT NULL,
    CONSTRAINT pk_invitado PRIMARY KEY (ci),
    CONSTRAINT fk_tipo_invitado_invitado FOREIGN KEY (fk_tipo_invitado) REFERENCES tipo_invitado(clave)
);

CREATE TABLE IF NOT EXISTS almacen (
    clave SERIAL,
    fk_presentacion INT NOT NULL,
    cantidad_unidades INT NOT NULL,
    CONSTRAINT pk_almacen PRIMARY KEY (clave),
    CONSTRAINT fk_presentacion_almacen FOREIGN KEY (fk_presentacion) REFERENCES presentacion(clave),
    CONSTRAINT unq_fk_presentacion_almacen UNIQUE (fk_presentacion),
    CONSTRAINT chk_cantidad_unidades CHECK (cantidad_unidades > 0)--creo que no podia llegar a 0 jamas
);

CREATE TABLE IF NOT EXISTS persona_contacto (
    clave SERIAL,
    primer_nombre VARCHAR(50) NOT NULL,
    primer_apellido VARCHAR(50) NOT NULL,
    fk_miembro INT,
    fk_cliente INT,
    CONSTRAINT pk_persona_contacto PRIMARY KEY (clave),
    CONSTRAINT fk_miembro_persona_contacto FOREIGN KEY (fk_miembro) REFERENCES miembro(rif),
    CONSTRAINT fk_cliente_persona_contacto FOREIGN KEY (fk_cliente) REFERENCES cliente(clave),--montar trigger de solo a tipo juridico
    CONSTRAINT chk_primer_nombre CHECK (primer_nombre <> ''),
    CONSTRAINT chk_primer_apellido CHECK (primer_apellido <> ''),
    -- Restricción de Arco (Exclusión Mutua)
    CONSTRAINT arco_persona_contacto CHECK (
        (CASE WHEN fk_miembro IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_cliente IS NOT NULL THEN 1 ELSE 0 END)
        = 1
    )
);

CREATE TABLE IF NOT EXISTS inventario_tienda (
    clave INT NOT NULL,
    fk_lugar_tienda INT NOT NULL,
    fk_presentacion INT NOT NULL,
    fk_tienda_fisica INT NOT NULL,
    cantidad INT NOT NULL,
    CONSTRAINT pk_inventario_tienda PRIMARY KEY (clave),
    --CONSTRAINT unq_fk_presentacion UNIQUE (fk_presentacion),  OJO
    CONSTRAINT fk_lugar_tienda_inventario FOREIGN KEY (fk_lugar_tienda) REFERENCES lugar_tienda(clave),
    CONSTRAINT fk_presentacion_inventario FOREIGN KEY (fk_presentacion) REFERENCES presentacion(clave),
    CONSTRAINT fk_tienda_fisica_inventario FOREIGN KEY (fk_tienda_fisica) REFERENCES tienda_fisica(clave)
);

CREATE TABLE IF NOT EXISTS inventario_evento (
    clave SERIAL,
    fk_presentacion INT NOT NULL,
    fk_evento INT NOT NULL,
    cantidad_unidades INT NOT NULL,
    CONSTRAINT pk_inventario_evento PRIMARY KEY (clave),
    CONSTRAINT fk_presentacion_inventario_evento FOREIGN KEY (fk_presentacion) REFERENCES presentacion(clave),
    CONSTRAINT fk_evento_inventario_evento FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT chk_cantidad_unidades CHECK (cantidad_unidades >= 0)--permite que el stock se acabe
);

CREATE TABLE IF NOT EXISTS compra (
    clave SERIAL,
    fecha DATE NOT NULL,
    monto_total INT NOT NULL,
    fk_miembro INT NOT NULL,
    CONSTRAINT pk_compra PRIMARY KEY (clave),
    CONSTRAINT fk_miembro_compra FOREIGN KEY (fk_miembro) REFERENCES miembro(rif),
    CONSTRAINT chk_monto_total CHECK (monto_total > 0)
);

CREATE TABLE IF NOT EXISTS venta_tienda_fisica (
    clave SERIAL,
    fecha DATE NOT NULL,
    total_venta DECIMAL(10,2) NOT NULL,
    fk_tienda_fisica INT NOT NULL,
    fk_cliente INT NOT NULL,
    CONSTRAINT pk_venta_tienda_fisica PRIMARY KEY (clave), 
    CONSTRAINT fk_tienda_fisica_venta_tienda_fisica FOREIGN KEY (fk_tienda_fisica) REFERENCES tienda_fisica(clave),
    CONSTRAINT fk_cliente_venta_tienda_fisica FOREIGN KEY (fk_cliente) REFERENCES cliente(clave),
    CONSTRAINT chk_total_venta CHECK (total_venta > 0)
);

CREATE TABLE IF NOT EXISTS venta_online (
    clave SERIAL,
    fecha DATE NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    direccion_envio VARCHAR(255) NOT NULL,
    fk_lugar INT NOT NULL,
    fk_tienda_online INT NOT NULL,
    fk_usuario INT NOT NULL,
    CONSTRAINT pk_venta_online PRIMARY KEY (clave), 
    CONSTRAINT fk_lugar_venta_online FOREIGN KEY (fk_lugar) REFERENCES lugar(clave),
    CONSTRAINT fk_tienda_online_venta_online FOREIGN KEY (fk_tienda_online) REFERENCES tienda_online(clave),
    CONSTRAINT fk_usuario_venta_online FOREIGN KEY (fk_usuario) REFERENCES usuario(clave),
    CONSTRAINT chk_monto_total CHECK (monto_total > 0)
);

CREATE TABLE IF NOT EXISTS venta_evento (
    clave SERIAL,
    fecha DATE NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    fk_evento INT NOT NULL,
    fk_cliente INT NOT NULL,
    CONSTRAINT pk_venta_evento PRIMARY KEY (clave),
    CONSTRAINT fk_evento_tienda_online FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT fk_cliente_tienda_online FOREIGN KEY (fk_cliente) REFERENCES cliente(clave)
);

CREATE TABLE IF NOT EXISTS venta_entrada (
    clave SERIAL,
    fecha DATE NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    fk_evento INT NOT NULL,
    fk_cliente INT,
    fk_usuario INT,
    CONSTRAINT pk_venta_entrada PRIMARY KEY (clave),
    CONSTRAINT fk_evento_venta_entrada FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT fk_cliente_venta_entrada FOREIGN KEY (fk_cliente) REFERENCES cliente(clave),
    CONSTRAINT fk_usuario_venta_entrada FOREIGN KEY (fk_usuario) REFERENCES usuario(clave),
    -- Restricción de Arco (Exclusión Mutua)
    CONSTRAINT arco_venta_entrada CHECK (
        (CASE WHEN fk_usuario IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_cliente IS NOT NULL THEN 1 ELSE 0 END)
        = 1
    )
 );

CREATE TABLE IF NOT EXISTS contrato (
    clave SERIAL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    monto_salario INT,
    fk_empleado INT NOT NULL,
    fk_cargo INT NOT NULL,
    fk_departamento INT NOT NULL,
    CONSTRAINT pk_contrato PRIMARY KEY (clave),
    CONSTRAINT fk_empleado_contrato FOREIGN KEY (fk_empleado) REFERENCES empleado(ci),
    CONSTRAINT fk_cargo_contrato FOREIGN KEY (fk_cargo) REFERENCES cargo(clave),
    CONSTRAINT fk_departamento_contrato FOREIGN KEY (fk_departamento) REFERENCES departamento(clave)
);

CREATE TABLE IF NOT EXISTS oferta (
    clave SERIAL,
    porcentaje_descuento INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL, 
    fk_presentacion INT NOT NULL,
    CONSTRAINT pk_oferta PRIMARY KEY (clave, fk_presentacion),
    CONSTRAINT fk_presentacion_oferta FOREIGN KEY (fk_presentacion) REFERENCES presentacion(clave),
    CONSTRAINT chk_fecha_oferta CHECK (fecha_inicio < fecha_fin),
    CONSTRAINT chk_porcentaje_oferta CHECK (porcentaje_descuento > 0 AND porcentaje_descuento < 100)
);

CREATE TABLE IF NOT EXISTS detalle_compra (
    clave SERIAL,
    fk_almacen INT NOT NULL,
    fk_compra INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_detalle_compra PRIMARY KEY (clave),
    CONSTRAINT fk_almacen_detalle_compra FOREIGN KEY (fk_almacen) REFERENCES almacen(clave),
    CONSTRAINT fk_compra_detalle_compra FOREIGN KEY (fk_compra) REFERENCES compra(clave),
    CONSTRAINT unq_almacen_compra UNIQUE (fk_compra),
    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario CHECK (precio_unitario > 0)
);

CREATE TABLE IF NOT EXISTS detalle_venta_fisica (
    clave SERIAL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    fk_venta_tienda_fisica INT NOT NULL,
    fk_inventario_tienda INT NOT NULL,
    CONSTRAINT pk_detalle_venta_fisica PRIMARY KEY (clave),
    CONSTRAINT fk_venta_tienda_fisica_detalle_venta_fisica FOREIGN KEY (fk_venta_tienda_fisica) REFERENCES venta_tienda_fisica(clave),
    CONSTRAINT fk_inventario_tienda_detalle_venta_fisica FOREIGN KEY (fk_inventario_tienda) REFERENCES inventario_tienda(clave),
    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario CHECK (precio_unitario > 0)
);

CREATE TABLE IF NOT EXISTS detalle_venta_online (
    clave SERIAL,
    fk_venta_online INT NOT NULL,
    fk_almacen INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_detalle_venta_online PRIMARY KEY (clave),
    CONSTRAINT fk_venta_online_detalle_venta_online FOREIGN KEY (fk_venta_online) REFERENCES venta_online(clave),
    CONSTRAINT fk_almacen_detalle_venta_online FOREIGN KEY (fk_almacen) REFERENCES almacen(clave),
    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario CHECK (precio_unitario > 0)
);

CREATE TABLE IF NOT EXISTS detalle_venta_evento (
    clave SERIAL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    fk_venta_evento INT NOT NULL,
    fk_inventario_evento INT NOT NULL,
    CONSTRAINT pk_detalle_venta_evento PRIMARY KEY (clave),
    CONSTRAINT fk_inventario_evento_detalle_venta_evento FOREIGN KEY (fk_inventario_evento) REFERENCES inventario_evento(clave),
    CONSTRAINT fk_venta_evento_detalle_venta_evento FOREIGN KEY (fk_venta_evento) REFERENCES venta_evento(clave)
 );

CREATE TABLE IF NOT EXISTS cuota (
    clave SERIAL,
    fecha DATE NOT NULL,
    monto INT NOT NULL,
    fk_miembro INT NOT NULL,
    CONSTRAINT pk_cuota PRIMARY KEY (clave),
    CONSTRAINT fk_miembro_cuota FOREIGN KEY (fk_miembro) REFERENCES miembro(rif)
);

CREATE TABLE IF NOT EXISTS pago (
    clave SERIAL,
    fecha_pago DATE NOT NULL,
    monto_total DECIMAL(15,2) NOT NULL,
    fk_tasa_cambio INT NOT NULL,
    fk_metodo_de_pago INT NOT NULL,
    fk_venta_tienda_fisica INT,
    fk_venta_online INT,
    fk_venta_evento INT,
    fk_venta_entrada INT,
    fk_cuota INT,
    fk_compra INT,
    CONSTRAINT pk_pago PRIMARY KEY (clave),
    CONSTRAINT fk_tasa_cambio_pago FOREIGN KEY (fk_tasa_cambio) REFERENCES tasa_cambio(clave),
    CONSTRAINT fk_metodo_de_pago_pago FOREIGN KEY (fk_metodo_de_pago) REFERENCES metodo_de_pago(clave),
    CONSTRAINT fk_venta_tienda_fisica_pago FOREIGN KEY (fk_venta_tienda_fisica) REFERENCES venta_tienda_fisica(clave),
    CONSTRAINT fk_venta_online_pago FOREIGN KEY (fk_venta_online) REFERENCES venta_online(clave),
    CONSTRAINT fk_venta_evento_pago FOREIGN KEY (fk_venta_evento) REFERENCES venta_evento(clave),
    CONSTRAINT fk_venta_entrada_pago FOREIGN KEY (fk_venta_entrada) REFERENCES venta_entrada(clave),
    CONSTRAINT fk_cuota_pago FOREIGN KEY (fk_cuota) REFERENCES cuota(clave),
    CONSTRAINT fk_compra_pago FOREIGN KEY (fk_compra) REFERENCES compra(clave),
    --arco de pago
    CONSTRAINT arco_pago CHECK (
        (CASE WHEN fk_venta_tienda_fisica IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_venta_online IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_venta_evento IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_venta_entrada IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_cuota IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_compra IS NOT NULL THEN 1 ELSE 0 END)
        = 1
    )
);

CREATE TABLE IF NOT EXISTS asistencia (
    clave SERIAL,
    fecha_entrada TIMESTAMP NOT NULL,
    fk_evento INT NOT NULL,
    fk_cliente INT NOT NULL,
    CONSTRAINT pk_asistencia PRIMARY KEY (clave),
    CONSTRAINT fk_evento_asistencia FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT fk_cliente_asistencia FOREIGN KEY (fk_cliente) REFERENCES cliente(clave)
 );

CREATE TABLE IF NOT EXISTS control_entrada (
    clave SERIAL,
    fecha_hora_entrada TIMESTAMP,
    fecha_hora_salida TIMESTAMP,
    fk_contrato INT NOT NULL,
    CONSTRAINT pk_control_entrada PRIMARY KEY (clave),
    CONSTRAINT fk_contrato_control_entrada FOREIGN KEY (fk_contrato) REFERENCES contrato(clave)
);

CREATE TABLE IF NOT EXISTS vacacion (
    clave SERIAL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    fk_contrato INT NOT NULL,
    CONSTRAINT pk_vacacion PRIMARY KEY (clave),
    CONSTRAINT fk_contrato_vacacion FOREIGN KEY (fk_contrato) REFERENCES contrato(clave)
);



CREATE TABLE IF NOT EXISTS reposicion (
    clave SERIAL,
    fk_almacen INT NOT NULL,
    fk_inventario_tienda INT NOT NULL,
    fk_usuario INT NOT NULL,
    cantidad INT NOT NULL,
    fecha DATE NOT NULL,
    CONSTRAINT pk_reposicion PRIMARY KEY (clave),
    CONSTRAINT fk_almacen_reposicion FOREIGN KEY (fk_almacen) REFERENCES almacen(clave),
    CONSTRAINT fk_inventario_tienda_reposicion FOREIGN KEY (fk_inventario_tienda) REFERENCES inventario_tienda(clave),
    -- que usuario ejecuta la reposicion
    CONSTRAINT fk_usuario_reposicion FOREIGN KEY (fk_usuario) REFERENCES usuario(clave),
    -- trigger de reposicion cuando haya poca cantidad en el inventario
    CONSTRAINT chk_cantidad CHECK (cantidad > 0)
);

CREATE TABLE IF NOT EXISTS eve_mie (
    clave SERIAL,
    descripcion_participacion TEXT,
    fk_miembro INT NOT NULL,
    fk_evento INT NOT NULL,
    CONSTRAINT pk_eve_mie PRIMARY KEY (clave),
    CONSTRAINT fk_miembro_eve_mie FOREIGN KEY (fk_miembro) REFERENCES miembro(rif),
    CONSTRAINT fk_evento_eve_mie FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT uq_eve_mie UNIQUE (fk_miembro, fk_evento)
);

CREATE TABLE IF NOT EXISTS car_tip (
    clave SERIAL,
    descripcion TEXT,
    valor INT,
    rango_menor INT,
    rango_mayor INT,
    fk_caracteristica INT NOT NULL,
    fk_tipo_cerveza INT NOT NULL,
    CONSTRAINT pk_car_tip PRIMARY KEY (clave),
    CONSTRAINT fk_caracteristica_car_tip FOREIGN KEY (fk_caracteristica) REFERENCES caracteristica(clave),
    CONSTRAINT fk_tipo_cerveza_car_tip FOREIGN KEY (fk_tipo_cerveza) REFERENCES tipo_cerveza(clave)
);

CREATE TABLE IF NOT EXISTS instruccion (
    clave SERIAL,
    descripcion TEXT NOT NULL,
    CONSTRAINT pk_instruccion PRIMARY KEY (clave)
);

CREATE TABLE IF NOT EXISTS ing_rec(
    clave SERIAL,
    cantidad DECIMAL(10,2) NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,--capaz crear type
    fk_receta INT NOT NULL,
    fk_ingrediente INT,--PERMITE INSTRUCCIONES SIN INGREDIENTES
    fk_instruccion INT NOT NULL,
    numero_paso INT NOT NULL,
    CONSTRAINT pk_ing_rec PRIMARY KEY (clave),
    CONSTRAINT fk_receta_ing_rec FOREIGN KEY (fk_receta) REFERENCES receta(clave),
    CONSTRAINT fk_ingrediente_ing_rec FOREIGN KEY (fk_ingrediente) REFERENCES ingrediente(clave),
    CONSTRAINT fk_instruccion_ing_rec FOREIGN KEY (fk_instruccion) REFERENCES instruccion(clave)

);



CREATE TABLE IF NOT EXISTS rol_pri (
    clave SERIAL,
    fecha DATE NOT NULL,
    fk_rol INT NOT NULL,
    fk_privilegio INT NOT NULL,
    CONSTRAINT pk_rol_pri PRIMARY KEY (clave),
    CONSTRAINT fk_rol_rol_pri FOREIGN KEY (fk_rol) REFERENCES rol(clave),
    CONSTRAINT fk_privilegio_rol_pri FOREIGN KEY (fk_privilegio) REFERENCES privilegio(clave)
);

CREATE TABLE IF NOT EXISTS emp_ben ( -- se pueden duplicar
    clave SERIAL,
    monto INT,
    --fecha DATE NOT NULL,
    fk_empleado INT NOT NULL,
    fk_tipo_beneficio INT NOT NULL,
    CONSTRAINT pk_emp_ben PRIMARY KEY (clave),
    CONSTRAINT fk_empleado_emp_ben FOREIGN KEY (fk_empleado) REFERENCES empleado(ci),
    CONSTRAINT fk_tipo_beneficio_emp_ben FOREIGN KEY (fk_tipo_beneficio) REFERENCES tipo_beneficio(clave),
    -- ??
    CONSTRAINT uq_tipo_beneficio UNIQUE (fk_empleado, fk_tipo_beneficio)
);

CREATE TABLE IF NOT EXISTS inv_eve (
    clave SERIAL,
    fecha_hora_entrada TIMESTAMP,
    fecha_hora_salida TIMESTAMP,
    fk_invitado INT NOT NULL,
    fk_evento INT NOT NULL,
    CONSTRAINT pk_inv_eve PRIMARY KEY (clave),
    CONSTRAINT fk_invitado_inv_eve FOREIGN KEY (fk_invitado) REFERENCES invitado(ci),
    CONSTRAINT fk_evento_inv_eve FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT uq_inv_eve UNIQUE (fk_invitado, fk_evento)
);

CREATE TABLE IF NOT EXISTS con_hor (
    clave SERIAL,
    horario_activo BOOLEAN,
    fk_horario INT NOT NULL,
    fk_contrato INT NOT NULL,
    CONSTRAINT pk_con_hor PRIMARY KEY (clave),
    CONSTRAINT fk_horario_con_hor FOREIGN KEY (fk_horario) REFERENCES horario(clave),
    CONSTRAINT fk_contrato_con_hor FOREIGN KEY (fk_contrato) REFERENCES contrato(clave)
);

CREATE TABLE IF NOT EXISTS car_cer (
    clave SERIAL,
    descripcion TEXT,
    valor INT,
    fk_caracteristica INT NOT NULL,
    fk_cerveza INT NOT NULL,
    CONSTRAINT pk_car_cer PRIMARY KEY (clave),
    CONSTRAINT fk_caracteristica_car_cer FOREIGN KEY (fk_caracteristica) REFERENCES caracteristica(clave),
    CONSTRAINT fk_cerveza_car_cer FOREIGN KEY (fk_cerveza) REFERENCES cerveza(clave)
);

CREATE TABLE IF NOT EXISTS historico (
    clave SERIAL,
    fecha TIMESTAMP NOT NULL,
    comentario TEXT,
    fk_estatus INT NOT NULL,
    fk_reposicion INT,
    fk_venta_online INT,
    fk_compra INT,
    fk_cuota INT,
    CONSTRAINT pk_historico PRIMARY KEY (clave),
    CONSTRAINT fk_estatus_historico FOREIGN KEY (fk_estatus) REFERENCES estatus(clave),
    CONSTRAINT fk_reposicion_historico FOREIGN KEY (fk_reposicion) REFERENCES reposicion(clave),
    CONSTRAINT fk_venta_online_historico FOREIGN KEY (fk_venta_online) REFERENCES venta_online(clave),
    CONSTRAINT fk_compra_historico FOREIGN KEY (fk_compra) REFERENCES compra(clave),
    CONSTRAINT fk_cuota_historico FOREIGN KEY (fk_cuota) REFERENCES cuota(clave),
    -- Restricción de Arco (Exclusión Mutua)
    CONSTRAINT arco_historico CHECK (
        (CASE WHEN fk_reposicion IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_venta_online IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_compra IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_cuota IS NOT NULL THEN 1 ELSE 0 END)
        = 1
    )
);

CREATE TABLE IF NOT EXISTS telefono ( --Los numeros deben ser unicos
    clave SERIAL,
    codigo INT NOT NULL,
    numero INT NOT NULL,
    extension INT,
    fk_empleado INT,
    fk_cliente INT,
    fk_miembro INT,
    fk_persona_contacto INT,
    CONSTRAINT pk_telefono PRIMARY KEY (clave),
    CONSTRAINT fk_empleado_telefono FOREIGN KEY (fk_empleado) REFERENCES empleado(ci),
    CONSTRAINT fk_cliente_telefono FOREIGN KEY (fk_cliente) REFERENCES cliente(clave),
    CONSTRAINT fk_miembro_telefono FOREIGN KEY (fk_miembro) REFERENCES miembro(rif),
    CONSTRAINT unq_fk_persona_contacto_telefono UNIQUE (fk_persona_contacto),
    CONSTRAINT unq_codigo_numero UNIQUE (codigo,numero),
    CONSTRAINT fk_persona_contacto_telefono FOREIGN KEY (fk_persona_contacto) REFERENCES persona_contacto(clave),
    CONSTRAINT chk_codigo CHECK (codigo IN (0414,0416,0412,0424,0426)),
    CONSTRAINT chk_numero CHECK (numero > 0 AND numero < 10000000),
    CONSTRAINT chk_extension CHECK (extension > 0 AND extension <= 10),
    --arco de telefono
    CONSTRAINT arco_telefono CHECK (
        (CASE WHEN fk_empleado IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_cliente IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_miembro IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_persona_contacto IS NOT NULL THEN 1 ELSE 0 END)
        = 1
    )
);

CREATE TABLE IF NOT EXISTS correo_electronico (
    clave SERIAL,
    direccion_email VARCHAR(100) NOT NULL,
    fk_cliente INT,
    fk_miembro INT,
    fk_persona_contacto INT,
    CONSTRAINT pk_correo_electronico PRIMARY KEY (clave),
    CONSTRAINT unq_fk_persona_contacto_correo_electronico UNIQUE (fk_persona_contacto),
    CONSTRAINT unq_fk_cliente UNIQUE (fk_cliente),
    CONSTRAINT fk_cliente_correo_electronico FOREIGN KEY (fk_cliente) REFERENCES cliente(clave),
    CONSTRAINT fk_miembro_correo_electronico FOREIGN KEY (fk_miembro) REFERENCES miembro(rif),
    CONSTRAINT fk_persona_contacto_correo_electronico FOREIGN KEY (fk_persona_contacto) REFERENCES persona_contacto(clave),
    CONSTRAINT chk_direccion_email CHECK (direccion_email LIKE '%@%.com'),
    --arco de correo electronico
    CONSTRAINT arco_correo_electronico CHECK (
        (CASE WHEN fk_cliente IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_miembro IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_persona_contacto IS NOT NULL THEN 1 ELSE 0 END)
        = 1
    )
);

-- =============================================
-- SCRIPT DE PROCEDIMIENTOS ALMACENADOS PARA ACAUCAB
-- Versión: 2.0
-- Descripción: Script idempotente para crear o reemplazar todos los
-- procedimientos y funciones del backend. Incluye sentencias DROP
-- para permitir la re-ejecución segura del script.
-- =============================================

-- =============================================
-- SECCIÓN DE DROPS INICIAL
-- Eliminamos procedimientos y funciones para permitir su recreación.
-- NOTA: El orden no es estricto aquí debido a `IF EXISTS`, pero es buena práctica.
-- =============================================

-- Auth
DROP FUNCTION IF EXISTS login_usuario(VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS obtener_permisos_por_rol(INT);
DROP FUNCTION IF EXISTS obtener_permisos_por_usuario(INT);

-- Privileges
DROP FUNCTION IF EXISTS obtener_todos_los_privilegios();
DROP FUNCTION IF EXISTS obtener_privilegio_por_id(INT);
DROP FUNCTION IF EXISTS crear_privilegio(VARCHAR, TEXT);
DROP FUNCTION IF EXISTS actualizar_privilegio(INT, VARCHAR, TEXT);
DROP FUNCTION IF EXISTS eliminar_privilegio(INT);

-- Roles
DROP FUNCTION IF EXISTS crear_rol(VARCHAR);
DROP FUNCTION IF EXISTS obtener_todos_los_roles();
DROP FUNCTION IF EXISTS obtener_rol_por_id(INT);
DROP FUNCTION IF EXISTS actualizar_rol(INT, VARCHAR);
DROP FUNCTION IF EXISTS eliminar_rol(INT);
DROP PROCEDURE IF EXISTS asignar_privilegios_a_rol(INT, INT[]);
DROP FUNCTION IF EXISTS obtener_privilegios_por_rol_id(INT);

-- Users
DROP FUNCTION IF EXISTS obtener_todos_los_usuarios();
DROP FUNCTION IF EXISTS obtener_usuario_por_id(INTEGER);
DROP FUNCTION IF EXISTS crear_usuario(VARCHAR, VARCHAR, INT, INT, INT, INT);
DROP FUNCTION IF EXISTS actualizar_usuario(INT, VARCHAR, VARCHAR, INT, INT, INT, INT);
DROP FUNCTION IF EXISTS asignar_rol_a_usuario(INT, INT);
DROP FUNCTION IF EXISTS eliminar_usuario(INT);
DROP FUNCTION IF EXISTS obtener_empleados_disponibles();
DROP FUNCTION IF EXISTS obtener_miembros_disponibles();
DROP FUNCTION IF EXISTS obtener_clientes_disponibles();

-- Clients
DROP FUNCTION IF EXISTS identificar_cliente_completo(INT);
DROP PROCEDURE IF EXISTS crear_cliente_natural(INT, INT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, INT, VARCHAR, JSON);
DROP PROCEDURE IF EXISTS crear_cliente_juridico(INT, VARCHAR, VARCHAR, VARCHAR, INT, VARCHAR, VARCHAR, INT, INT, VARCHAR, JSON);
DROP FUNCTION IF EXISTS obtener_lugares_jerarquia();
DROP FUNCTION IF EXISTS obtener_lugares_planos();
DROP FUNCTION IF EXISTS obtener_puntos_cliente(INT);
DROP FUNCTION IF EXISTS verificar_cliente_por_tipo(VARCHAR, VARCHAR);

-- Shop
DROP FUNCTION IF EXISTS obtener_productos_disponibles(INT, TEXT, TEXT, BOOLEAN, INT, INT);
DROP FUNCTION IF EXISTS obtener_metodos_pago_favoritos(INT);
DROP FUNCTION IF EXISTS obtener_tiendas_fisicas();
DROP FUNCTION IF EXISTS obtener_tasa_cambio(tipo_moneda);
DROP FUNCTION IF EXISTS crear_venta_online(INT, VARCHAR, INT, JSON, JSON);
DROP FUNCTION IF EXISTS crear_venta_fisica(INT, INT, JSON, JSON);
DROP FUNCTION IF EXISTS obtener_producto_por_ean(BIGINT, INT);
DROP FUNCTION IF EXISTS obtener_venta_completa(INT);
DROP FUNCTION IF EXISTS obtener_venta_online_completa(INT);

-- Reposiciones
DROP FUNCTION IF EXISTS obtener_todas_las_reposiciones();
DROP FUNCTION IF EXISTS obtener_reposiciones_por_tienda(INT);
DROP FUNCTION IF EXISTS obtener_reposicion_por_id(INT);
DROP FUNCTION IF EXISTS actualizar_estado_reposicion(INT, INT, TEXT);
DROP FUNCTION IF EXISTS obtener_jefes_pasillo_por_tienda(INT);
DROP FUNCTION IF EXISTS crear_reposicion_manual(INT, INT, INT, INT);
DROP FUNCTION IF EXISTS obtener_reposiciones_con_detalles();
DROP FUNCTION IF EXISTS obtener_estadisticas_reposiciones(INT);

-- =============================================
-- PROCEDIMIENTOS PARA AUTHENTICATION (authController.js)
-- =============================================

-- 1. Procedimiento para el login de usuario
CREATE OR REPLACE FUNCTION login_usuario(
    p_username VARCHAR(50),
    p_password VARCHAR(255)
)
RETURNS TABLE (
    usuario_id INT,
    username VARCHAR(50),
    fk_rol INT,
    rol_nombre VARCHAR(50),
    tipo_entidad TEXT,
    empleado_ci INT,
    empleado_primer_nombre VARCHAR(50),
    empleado_primer_apellido VARCHAR(50),
    empleado_segundo_nombre VARCHAR(50),
    empleado_segundo_apellido VARCHAR(50),
    cargo_nombre VARCHAR(50),
    departamento_nombre VARCHAR(50),
    miembro_rif INT,
    miembro_razon_social VARCHAR(50),
    cliente_id INT,
    cliente_primer_nombre VARCHAR(50),
    cliente_primer_apellido VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.clave as usuario_id,
        u.username,
        u.fk_rol,
        r.nombre as rol_nombre,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN 'empleado' 
            WHEN u.fk_miembro IS NOT NULL THEN 'miembro'
            WHEN u.fk_cliente IS NOT NULL THEN 'cliente'
            ELSE NULL 
        END as tipo_entidad,
        e.ci as empleado_ci,
        e.primer_nombre as empleado_primer_nombre,
        e.primer_apellido as empleado_primer_apellido,
        e.segundo_nombre as empleado_segundo_nombre,
        e.segundo_apellido as empleado_segundo_apellido,
        c.nombre as cargo_nombre,
        d.nombre as departamento_nombre,
        m.rif as miembro_rif,
        m.razon_social as miembro_razon_social,
        cl.clave as cliente_id,
        cl.primer_nombre as cliente_primer_nombre,
        cl.primer_apellido as cliente_primer_apellido
    FROM usuario u
    JOIN rol r ON u.fk_rol = r.clave
    LEFT JOIN empleado e ON u.fk_empleado = e.ci
    LEFT JOIN contrato ct ON e.ci = ct.fk_empleado AND ct.fecha_fin IS NULL
    LEFT JOIN cargo c ON ct.fk_cargo = c.clave
    LEFT JOIN departamento d ON ct.fk_departamento = d.clave
    LEFT JOIN miembro m ON u.fk_miembro = m.rif
    LEFT JOIN cliente cl ON u.fk_cliente = cl.clave
    WHERE u.username = p_username AND u.contrasena = p_password;
END;
$$;

-- 2. Procedimiento para obtener permisos por rol
CREATE OR REPLACE FUNCTION obtener_permisos_por_rol(
    p_rol_id INT
)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.clave, p.nombre, p.descripcion
    FROM privilegio p
    JOIN rol_pri rp ON p.clave = rp.fk_privilegio
    WHERE rp.fk_rol = p_rol_id
    ORDER BY p.nombre;
END;
$$;

-- 3. Procedimiento para obtener permisos por usuario
CREATE OR REPLACE FUNCTION obtener_permisos_por_usuario(
    p_usuario_id INT
)
RETURNS TABLE (
    nombre VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.nombre
    FROM privilegio p
    JOIN rol_pri rp ON p.clave = rp.fk_privilegio
    JOIN usuario u ON rp.fk_rol = u.fk_rol
    WHERE u.clave = p_usuario_id;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA PRIVILEGES (privilegeController.js)
-- =============================================

-- 1. Obtener todos los privilegios
CREATE OR REPLACE FUNCTION obtener_todos_los_privilegios()
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.clave, p.nombre, p.descripcion 
    FROM privilegio p
    ORDER BY p.nombre ASC;
END;
$$;

-- 2. Obtener privilegio por ID
CREATE OR REPLACE FUNCTION obtener_privilegio_por_id(p_id INT)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.clave, p.nombre, p.descripcion 
    FROM privilegio p
    WHERE p.clave = p_id;
END;
$$;

-- 3. Crear un nuevo privilegio
CREATE OR REPLACE FUNCTION crear_privilegio(
    p_nombre VARCHAR(50),
    p_descripcion TEXT
)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO privilegio (nombre, descripcion)
    VALUES (p_nombre, p_descripcion)
    RETURNING privilegio.clave, privilegio.nombre, privilegio.descripcion;
END;
$$;

-- 4. Actualizar un privilegio
CREATE OR REPLACE FUNCTION actualizar_privilegio(
    p_id INT,
    p_nombre VARCHAR(50),
    p_descripcion TEXT
)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE privilegio 
    SET nombre = p_nombre, descripcion = p_descripcion
    WHERE clave = p_id
    RETURNING privilegio.clave, privilegio.nombre, privilegio.descripcion;
END;
$$;

-- 5. Eliminar un privilegio
CREATE OR REPLACE FUNCTION eliminar_privilegio(p_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INT;
BEGIN
    DELETE FROM privilegio 
    WHERE clave = p_id 
    RETURNING clave INTO deleted_id;
    RETURN deleted_id;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA ROLES (roleController.js)
-- =============================================

-- 1. Crear un nuevo rol
CREATE OR REPLACE FUNCTION crear_rol(p_nombre VARCHAR(50))
RETURNS TABLE (clave INT, nombre VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO rol (nombre) VALUES (p_nombre)
    RETURNING rol.clave, rol.nombre;
END;
$$;

-- 2. Obtener todos los roles
CREATE OR REPLACE FUNCTION obtener_todos_los_roles()
RETURNS TABLE (clave INT, nombre VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT r.clave, r.nombre FROM rol r ORDER BY r.nombre ASC;
END;
$$;

-- 3. Obtener un rol por ID
CREATE OR REPLACE FUNCTION obtener_rol_por_id(p_id INT)
RETURNS TABLE (clave INT, nombre VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT r.clave, r.nombre FROM rol r WHERE r.clave = p_id;
END;
$$;

-- 4. Actualizar un rol
CREATE OR REPLACE FUNCTION actualizar_rol(p_id INT, p_nombre VARCHAR(50))
RETURNS TABLE (clave INT, nombre VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE rol SET nombre = p_nombre WHERE clave = p_id
    RETURNING rol.clave, rol.nombre;
END;
$$;

-- 5. Eliminar un rol
CREATE OR REPLACE FUNCTION eliminar_rol(p_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INT;
BEGIN
    DELETE FROM rol WHERE clave = p_id
    RETURNING clave INTO deleted_id;
    RETURN deleted_id;
END;
$$;

-- 6. Asignar privilegios a un rol
CREATE OR REPLACE PROCEDURE asignar_privilegios_a_rol(
    p_rol_id INT,
    p_privilegios_ids INT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Eliminar los privilegios antiguos para este rol
    DELETE FROM rol_pri WHERE fk_rol = p_rol_id;

    -- Insertar los nuevos privilegios si el array no está vacío
    IF array_length(p_privilegios_ids, 1) > 0 THEN
        INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha)
        SELECT p_rol_id, unnest(p_privilegios_ids), CURRENT_DATE;
    END IF;
END;
$$;

-- 7. Obtener privilegios por ID de rol
CREATE OR REPLACE FUNCTION obtener_privilegios_por_rol_id(p_rol_id INT)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.clave, p.nombre, p.descripcion
    FROM privilegio p
    JOIN rol_pri rp ON p.clave = rp.fk_privilegio
    WHERE rp.fk_rol = p_rol_id
    ORDER BY p.nombre ASC;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA USUARIOS (userController.js)
-- =============================================

-- 1. Obtener todos los usuarios con sus detalles
CREATE OR REPLACE FUNCTION obtener_todos_los_usuarios()
RETURNS TABLE (
    clave INTEGER,
    username VARCHAR,
    rol_id INTEGER,
    rol_nombre VARCHAR,
    tipo_entidad TEXT,
    entidad_id BIGINT,
    nombre_completo TEXT,
    permisos JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.clave,
        u.username,
        r.clave as rol_id,
        r.nombre as rol_nombre,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN 'empleado'
            WHEN u.fk_miembro IS NOT NULL THEN 'miembro'
            WHEN u.fk_cliente IS NOT NULL THEN 'cliente'
            ELSE 'N/A'
        END AS tipo_entidad,
        COALESCE(u.fk_empleado::BIGINT, u.fk_miembro::BIGINT, u.fk_cliente::BIGINT) as entidad_id,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN (e.primer_nombre || ' ' || e.primer_apellido)
            WHEN u.fk_miembro IS NOT NULL THEN m.razon_social
            WHEN u.fk_cliente IS NOT NULL THEN (c.primer_nombre || ' ' || c.primer_apellido)
            ELSE 'N/A'
        END AS nombre_completo,
        (SELECT json_agg(p.nombre) 
         FROM privilegio p
         JOIN rol_pri rp ON p.clave = rp.fk_privilegio
         WHERE rp.fk_rol = u.fk_rol) AS permisos
    FROM 
        usuario u
    JOIN 
        rol r ON u.fk_rol = r.clave
    LEFT JOIN 
        empleado e ON u.fk_empleado = e.ci AND u.fk_empleado IS NOT NULL
    LEFT JOIN 
        miembro m ON u.fk_miembro = m.rif AND u.fk_miembro IS NOT NULL
    LEFT JOIN 
        cliente c ON u.fk_cliente = c.clave AND u.fk_cliente IS NOT NULL
    ORDER BY u.clave ASC;
END;
$$;

-- 2. Obtener un usuario por su ID con detalles
CREATE OR REPLACE FUNCTION obtener_usuario_por_id(p_usuario_id INTEGER)
RETURNS TABLE (
    clave INTEGER,
    username VARCHAR,
    rol_id INTEGER,
    rol_nombre VARCHAR,
    tipo_entidad TEXT,
    entidad_id BIGINT,
    nombre_completo TEXT,
    permisos JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.clave,
        u.username,
        r.clave as rol_id,
        r.nombre as rol_nombre,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN 'empleado'
            WHEN u.fk_miembro IS NOT NULL THEN 'miembro'
            WHEN u.fk_cliente IS NOT NULL THEN 'cliente'
            ELSE 'N/A'
        END AS tipo_entidad,
        COALESCE(u.fk_empleado::BIGINT, u.fk_miembro::BIGINT, u.fk_cliente::BIGINT) as entidad_id,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN (e.primer_nombre || ' ' || e.primer_apellido)
            WHEN u.fk_miembro IS NOT NULL THEN m.razon_social
            WHEN u.fk_cliente IS NOT NULL THEN (c.primer_nombre || ' ' || c.primer_apellido)
            ELSE 'N/A'
        END AS nombre_completo,
        (SELECT json_agg(p.nombre) 
         FROM privilegio p
         JOIN rol_pri rp ON p.clave = rp.fk_privilegio
         WHERE rp.fk_rol = u.fk_rol) AS permisos
    FROM 
        usuario u
    JOIN 
        rol r ON u.fk_rol = r.clave
    LEFT JOIN 
        empleado e ON u.fk_empleado = e.ci AND u.fk_empleado IS NOT NULL
    LEFT JOIN 
        miembro m ON u.fk_miembro = m.rif AND u.fk_miembro IS NOT NULL
    LEFT JOIN 
        cliente c ON u.fk_cliente = c.clave AND u.fk_cliente IS NOT NULL
    WHERE u.clave = p_usuario_id;
END;
$$;

-- 3. Crear un nuevo usuario
CREATE OR REPLACE FUNCTION crear_usuario(
    p_username VARCHAR(50),
    p_contrasena VARCHAR(255),
    p_fk_rol INT,
    p_fk_empleado INT,
    p_fk_miembro INT,
    p_fk_cliente INT
)
RETURNS SETOF usuario
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_contrasena IS NULL OR p_contrasena = '' THEN
        RAISE EXCEPTION 'La contraseña no puede ser nula o vacía';
    END IF;

    RETURN QUERY
    INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente)
    VALUES (p_username, p_contrasena, p_fk_rol, p_fk_empleado, p_fk_miembro, p_fk_cliente)
    RETURNING *;
END;
$$;

-- 4. Actualizar un usuario
CREATE OR REPLACE FUNCTION actualizar_usuario(
    p_clave INT,
    p_username VARCHAR(50),
    p_contrasena VARCHAR(255),
    p_fk_rol INT,
    p_fk_empleado INT,
    p_fk_miembro INT,
    p_fk_cliente INT
)
RETURNS SETOF usuario
LANGUAGE plpgsql
AS $$
DECLARE
    v_contrasena_sql TEXT;
BEGIN
    -- Si no se proporciona contraseña, no se actualiza
    v_contrasena_sql := CASE
        WHEN p_contrasena IS NOT NULL AND p_contrasena <> '' 
        THEN p_contrasena
        ELSE (SELECT contrasena FROM usuario WHERE clave = p_clave)
    END;

    RETURN QUERY
    UPDATE usuario
    SET
        username = p_username,
        contrasena = v_contrasena_sql,
        fk_rol = p_fk_rol,
        fk_empleado = p_fk_empleado,
        fk_miembro = p_fk_miembro,
        fk_cliente = p_fk_cliente
    WHERE clave = p_clave
    RETURNING *;
END;
$$;

-- 5. Asignar rol a usuario
CREATE OR REPLACE FUNCTION asignar_rol_a_usuario(
    p_user_id INT,
    p_rol_id INT
)
RETURNS SETOF usuario
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verificar que el rol existe para evitar errores de FK
    IF NOT EXISTS (SELECT 1 FROM rol WHERE clave = p_rol_id) THEN
        RAISE EXCEPTION 'El rol con ID % no existe.', p_rol_id;
    END IF;

    RETURN QUERY
    UPDATE usuario SET fk_rol = p_rol_id WHERE clave = p_user_id
    RETURNING *;
END;
$$;

-- 6. Eliminar un usuario
CREATE OR REPLACE FUNCTION eliminar_usuario(p_clave INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INT;
BEGIN
    DELETE FROM usuario 
    WHERE clave = p_clave 
    RETURNING clave INTO deleted_id;
    RETURN deleted_id;
END;
$$;

-- 7. Obtener empleados disponibles para ser usuarios
CREATE OR REPLACE FUNCTION obtener_empleados_disponibles()
RETURNS TABLE (
    ci INT,
    nombre_completo TEXT,
    telefono TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.ci, 
        (e.primer_nombre || ' ' || e.primer_apellido)::TEXT as nombre_completo,
        CONCAT(t.codigo, '-', t.numero)::TEXT as telefono
    FROM empleado e
    LEFT JOIN usuario u ON e.ci = u.fk_empleado
    LEFT JOIN telefono t ON e.ci = t.fk_empleado
    WHERE u.fk_empleado IS NULL
    ORDER BY e.primer_nombre, e.primer_apellido;
END;
$$;

-- 8. Obtener miembros disponibles para ser usuarios
CREATE OR REPLACE FUNCTION obtener_miembros_disponibles()
RETURNS TABLE (
    rif INT,
    razon_social VARCHAR,
    email VARCHAR,
    telefono TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.rif, 
        m.razon_social, 
        ce.direccion_email AS email,
        CONCAT(t.codigo, '-', t.numero)::TEXT AS telefono
    FROM miembro m
    LEFT JOIN usuario u ON m.rif = u.fk_miembro
    LEFT JOIN correo_electronico ce ON m.rif = ce.fk_miembro
    LEFT JOIN telefono t ON m.rif = t.fk_miembro
    WHERE u.fk_miembro IS NULL
    ORDER BY m.razon_social;
END;
$$;

-- 9. Obtener clientes disponibles para ser usuarios
CREATE OR REPLACE FUNCTION obtener_clientes_disponibles()
RETURNS TABLE (
    clave INT,
    nombre_completo TEXT,
    ci INT,
    email VARCHAR,
    telefono TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.clave, 
        (c.primer_nombre || ' ' || c.primer_apellido)::TEXT as nombre_completo,
        c.ci,
        ce.direccion_email AS email,
        CONCAT(t.codigo, '-', t.numero)::TEXT AS telefono
    FROM cliente c
    LEFT JOIN usuario u ON c.clave = u.fk_cliente
    LEFT JOIN correo_electronico ce ON c.clave = ce.fk_cliente
    LEFT JOIN telefono t ON c.clave = t.fk_cliente
    WHERE u.fk_cliente IS NULL
    ORDER BY c.primer_nombre, c.primer_apellido;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA CLIENTES (clientController.js)
-- =============================================

-- 1. Identificar cliente completo por documento (CI o RIF)
CREATE OR REPLACE FUNCTION identificar_cliente_completo(p_documento INT)
RETURNS TABLE (
    cliente_info JSON,
    contactos JSON,
    telefonos JSON,
    correos JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH cliente_base AS (
        SELECT *
        FROM cliente c
        WHERE (c.tipo = 'natural' AND (c.ci = p_documento OR c.rif = p_documento))
           OR (c.tipo = 'juridico' AND c.rif = p_documento)
        LIMIT 1
    )
    SELECT
        to_json(cb.*) as cliente_info,
        (SELECT json_agg(pc.*) FROM persona_contacto pc WHERE pc.fk_cliente = cb.clave) as contactos,
        (SELECT json_agg(t.*) FROM telefono t WHERE t.fk_cliente = cb.clave) as telefonos,
        (SELECT json_agg(ce.*) FROM correo_electronico ce WHERE ce.fk_cliente = cb.clave) as correos
    FROM cliente_base cb;
END;
$$;

-- 2. Crear cliente natural
CREATE OR REPLACE PROCEDURE crear_cliente_natural(
    p_ci INT, p_rif INT, p_primer_nombre VARCHAR(50), p_segundo_nombre VARCHAR(50),
    p_primer_apellido VARCHAR(50), p_segundo_apellido VARCHAR(50), p_direccion_habitacion VARCHAR(255),
    p_fk_lugar INT, p_correo VARCHAR(100), p_telefonos JSON
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_cliente_id INT;
    tel RECORD;
BEGIN
    INSERT INTO cliente (
        ci, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        direccion_habitacion, fk_direccion_habitacion, tipo
    ) VALUES (
        p_ci, p_rif, p_primer_nombre, p_segundo_nombre, p_primer_apellido, p_segundo_apellido,
        p_direccion_habitacion, p_fk_lugar, 'natural'
    ) RETURNING clave INTO new_cliente_id;

    INSERT INTO correo_electronico (direccion_email, fk_cliente) VALUES (p_correo, new_cliente_id);

    FOR tel IN SELECT * FROM json_to_recordset(p_telefonos) AS x(codigo VARCHAR, numero VARCHAR)
    LOOP
        INSERT INTO telefono (codigo, numero, fk_cliente) VALUES (tel.codigo, tel.numero, new_cliente_id);
    END LOOP;
END;
$$;


-- 3. Crear cliente jurídico
CREATE OR REPLACE PROCEDURE crear_cliente_juridico(
    p_rif INT, p_razon_social VARCHAR(50), p_denominacion_comercial VARCHAR(50),
    p_url_pagina_web VARCHAR(100), p_capital_disponible INT, p_direccion_fiscal VARCHAR(255),
    p_direccion_fisica VARCHAR(255), p_fk_fiscal INT, p_fk_fisica INT,
    p_correo VARCHAR(100), p_telefonos JSON
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_cliente_id INT;
    tel RECORD;
BEGIN
    INSERT INTO cliente (
        rif, razon_social, denominacion_comercial, url_pagina_web, capital_disponible,
        direccion_fiscal, direccion_fisica, fk_direccion_fiscal, fk_direccion_fisica, tipo
    ) VALUES (
        p_rif, p_razon_social, p_denominacion_comercial, p_url_pagina_web, p_capital_disponible,
        p_direccion_fiscal, p_direccion_fisica, p_fk_fiscal, p_fk_fisica, 'juridico'
    ) RETURNING clave INTO new_cliente_id;

    INSERT INTO correo_electronico (direccion_email, fk_cliente) VALUES (p_correo, new_cliente_id);

    FOR tel IN SELECT * FROM json_to_recordset(p_telefonos) AS x(codigo VARCHAR, numero VARCHAR)
    LOOP
        INSERT INTO telefono (codigo, numero, fk_cliente) VALUES (tel.codigo, tel.numero, new_cliente_id);
    END LOOP;
END;
$$;


-- 4. Obtener todos los lugares con jerarquía
CREATE OR REPLACE FUNCTION obtener_lugares_jerarquia()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    result JSON;
BEGIN
    WITH RECURSIVE lugar_recursivo AS (
        SELECT clave, nombre, tipo, fk_lugar, 1 as nivel, CAST(nombre AS TEXT) as path
        FROM lugar
        WHERE fk_lugar IS NULL
        UNION ALL
        SELECT l.clave, l.nombre, l.tipo, l.fk_lugar, lr.nivel + 1, CAST(lr.path || ' -> ' || l.nombre AS TEXT)
        FROM lugar l
        JOIN lugar_recursivo lr ON l.fk_lugar = lr.clave
    )
    SELECT json_agg(row_to_json(lr)) INTO result
    FROM lugar_recursivo lr;
    RETURN result;
END;
$$;

-- 5. Obtener lugares sin jerarquía (planos)
CREATE OR REPLACE FUNCTION obtener_lugares_planos()
RETURNS TABLE (clave INT, nombre VARCHAR(50), tipo VARCHAR(20), fk_lugar INT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT l.clave, l.nombre, l.tipo, l.fk_lugar FROM lugar l ORDER BY l.clave;
END;
$$;

-- 6. Obtener puntos de un cliente
CREATE OR REPLACE FUNCTION obtener_puntos_cliente(p_cliente_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    puntos INT;
BEGIN
    SELECT puntos_acumulados INTO puntos FROM cliente WHERE clave = p_cliente_id;
    RETURN puntos;
END;
$$;

-- 7. Verificar existencia de cliente por tipo y documento
CREATE OR REPLACE FUNCTION verificar_cliente_por_tipo(p_tipo VARCHAR(20), p_documento VARCHAR(50))
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    existe BOOLEAN;
BEGIN
    IF p_tipo = 'natural' THEN
        SELECT EXISTS(SELECT 1 FROM cliente WHERE ci = p_documento::INT) INTO existe;
    ELSIF p_tipo = 'juridico' THEN
        SELECT EXISTS(SELECT 1 FROM cliente WHERE rif = p_documento::INT) INTO existe;
    ELSE
        existe := FALSE;
    END IF;
    RETURN existe;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA TIENDA (shopController.js)
-- =============================================

-- 1. Obtener productos disponibles (unificado)
CREATE OR REPLACE FUNCTION obtener_productos_disponibles(
    p_tienda_id INT,
    p_busqueda TEXT,
    p_tipo_cerveza TEXT,
    p_solo_con_oferta BOOLEAN,
    p_limite INT,
    p_offset INT
)
RETURNS TABLE (
    clave INT,
    ean_13 BIGINT,
    nombre_presentacion VARCHAR(50),
    cantidad_unidades INT,
    precio NUMERIC,
    nombre_cerveza VARCHAR(50),
    grado_alcohol INT,
    tipo_cerveza VARCHAR(50),
    miembro VARCHAR(50),
    cantidad_disponible INT,
    tiene_oferta BOOLEAN,
    porcentaje_descuento INT,
    precio_oferta NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.clave,
        p.ean_13,
        p.nombre AS nombre_presentacion,
        p.cantidad_unidades,
        p.precio,
        c.nombre AS nombre_cerveza,
        c.grado_alcohol,
        tc.nombre AS tipo_cerveza,
        m.razon_social AS miembro,
        it.cantidad AS cantidad_disponible,
        CASE 
          WHEN o.clave IS NOT NULL AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin 
          THEN true 
          ELSE false 
        END AS tiene_oferta,
        o.porcentaje_descuento,
        ROUND((p.precio * (1 - (COALESCE(o.porcentaje_descuento, 0)::DECIMAL / 100))), 2) AS precio_oferta
    FROM presentacion p
    INNER JOIN cerveza c ON p.fk_cerveza = c.clave
    INNER JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
    INNER JOIN miembro m ON c.fk_miembro = m.rif
    INNER JOIN inventario_tienda it ON p.clave = it.fk_presentacion
    LEFT JOIN oferta o ON p.clave = o.fk_presentacion AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin
    WHERE it.cantidad > 0
      AND (p_tienda_id IS NULL OR it.fk_tienda_fisica = p_tienda_id)
      AND (p_busqueda IS NULL OR (
          LOWER(c.nombre) LIKE LOWER('%' || p_busqueda || '%') OR
          LOWER(p.nombre) LIKE LOWER('%' || p_busqueda || '%') OR
          CAST(p.ean_13 AS TEXT) LIKE '%' || p_busqueda || '%'
      ))
      AND (p_tipo_cerveza IS NULL OR LOWER(tc.nombre) = LOWER(p_tipo_cerveza))
      AND (p_solo_con_oferta IS FALSE OR o.clave IS NOT NULL)
    ORDER BY p.nombre
    LIMIT p_limite OFFSET p_offset;
END;
$$;

-- 2. Obtener métodos de pago favoritos de un cliente
CREATE OR REPLACE FUNCTION obtener_metodos_pago_favoritos(p_cliente_id INT)
RETURNS TABLE (
    id INT,
    banco VARCHAR(50),
    numero_tarjeta VARCHAR(20),
    fecha_vencimiento DATE,
    tipo TEXT,
    moneda tipo_moneda
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.clave as id,
        mp.banco,
        CAST(mp.numero_tarjeta AS VARCHAR) as numero_tarjeta,
        mp.fecha_vencimiento,
        CASE WHEN mp.tipo = 'Tarjeta de credito' THEN 'credito' ELSE 'debito' END as tipo,
        mp.moneda
    FROM metodo_de_pago mp
    WHERE mp.fk_cliente = p_cliente_id 
      AND mp.metodo_preferido = true 
      AND mp.tipo IN ('Tarjeta de credito', 'Tarjeta de debito');
END;
$$;

-- 3. Obtener todas las tiendas físicas
CREATE OR REPLACE FUNCTION obtener_tiendas_fisicas()
RETURNS TABLE (clave INT, nombre VARCHAR(50), direccion TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT tf.clave, tf.nombre, tf.direccion FROM tienda_fisica tf;
END;
$$;

-- 4. Obtener tasa de cambio por moneda
CREATE OR REPLACE FUNCTION obtener_tasa_cambio(p_moneda tipo_moneda)
RETURNS SETOF tasa_cambio
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM tasa_cambio 
    WHERE moneda = p_moneda AND fecha_fin IS NULL 
    ORDER BY fecha_inicio DESC 
    LIMIT 1;
END;
$$;

-- 5. Crear Venta Online
CREATE OR REPLACE FUNCTION crear_venta_online(
    p_usuario_id INT,
    p_direccion_envio VARCHAR,
    p_lugar_id INT,
    p_items JSON,
    p_pagos JSON
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    item RECORD;
    pago RECORD;
    total_venta NUMERIC := 0;
    v_venta_id INT;
    v_almacen_id INT;
    DEFAULT_TIENDA_ONLINE_ID INT := 1; -- Asumiendo que existe una tienda online con id 1
BEGIN
    -- Calcular el monto total de la venta a partir de los items
    FOR item IN SELECT * FROM json_to_recordset(p_items) AS x(presentacion_id INT, cantidad INT, precio_unitario NUMERIC)
    LOOP
        total_venta := total_venta + (item.cantidad * item.precio_unitario);
    END LOOP;

    -- Insertar la cabecera de la venta online
    INSERT INTO venta_online (fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario)
    VALUES (CURRENT_DATE, total_venta, p_direccion_envio, p_lugar_id, DEFAULT_TIENDA_ONLINE_ID, p_usuario_id)
    RETURNING clave INTO v_venta_id;

    -- Insertar detalles de la venta y actualizar el stock en el almacén central
    FOR item IN SELECT * FROM json_to_recordset(p_items) AS x(presentacion_id INT, cantidad INT, precio_unitario NUMERIC)
    LOOP
        SELECT clave INTO v_almacen_id FROM almacen WHERE fk_presentacion = item.presentacion_id;
        
        IF v_almacen_id IS NULL THEN
            RAISE EXCEPTION 'No se encontró el almacén para la presentación %', item.presentacion_id;
        END IF;

        INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
        VALUES (v_venta_id, v_almacen_id, item.cantidad, item.precio_unitario);

        UPDATE almacen SET cantidad_unidades = cantidad_unidades - item.cantidad WHERE clave = v_almacen_id;
    END LOOP;

    -- Insertar los registros de pago asociados a la venta
    FOR pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(metodo_pago_id INT, monto NUMERIC, tasa_cambio_id INT)
    LOOP
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online)
        VALUES (CURRENT_DATE, pago.monto, pago.tasa_cambio_id, pago.metodo_pago_id, v_venta_id);
    END LOOP;
    
    RETURN v_venta_id;
END;
$$;

-- 6. Crear venta física (función que retorna el ID de la venta)
CREATE OR REPLACE FUNCTION crear_venta_fisica(
    p_tienda_id INT,
    p_cliente_id INT,
    p_items JSON,
    p_pagos JSON
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    item RECORD;
    pago RECORD;
    total_venta NUMERIC := 0;
    inv_tienda_id INT;
    v_venta_id INT;
BEGIN
    -- Calcular el monto total de la venta
    FOR item IN SELECT * FROM json_to_recordset(p_items) AS x(presentacion_id INT, cantidad INT, precio_unitario NUMERIC)
    LOOP
        total_venta := total_venta + (item.cantidad * item.precio_unitario);
    END LOOP;

    -- Insertar la venta
    INSERT INTO venta_tienda_fisica (fecha, total_venta, fk_tienda_fisica, fk_cliente)
    VALUES (CURRENT_DATE, total_venta, p_tienda_id, p_cliente_id)
    RETURNING clave INTO v_venta_id;

    -- Insertar detalles de la venta y actualizar inventario
    FOR item IN SELECT * FROM json_to_recordset(p_items) AS x(presentacion_id INT, cantidad INT, precio_unitario NUMERIC)
    LOOP
        SELECT clave INTO inv_tienda_id FROM inventario_tienda WHERE fk_presentacion = item.presentacion_id AND fk_tienda_fisica = p_tienda_id;
        
        INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
        VALUES (item.cantidad, item.precio_unitario, v_venta_id, inv_tienda_id);

        UPDATE inventario_tienda SET cantidad = cantidad - item.cantidad WHERE clave = inv_tienda_id;
    END LOOP;

    -- Insertar pagos
    FOR pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(metodo_pago_id INT, monto NUMERIC, tasa_cambio_id INT)
    LOOP
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica)
        VALUES (CURRENT_DATE, pago.monto, pago.tasa_cambio_id, pago.metodo_pago_id, v_venta_id);
    END LOOP;
    
    RETURN v_venta_id;
END;
$$;

-- 7. Obtener producto por EAN
CREATE OR REPLACE FUNCTION obtener_producto_por_ean(p_ean BIGINT, p_tienda_id INT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    producto_json JSON;
BEGIN
    SELECT row_to_json(t)
    INTO producto_json
    FROM (
        SELECT 
            p.clave, p.nombre, p.precio, c.nombre as cerveza, it.cantidad as stock
        FROM presentacion p
        JOIN cerveza c ON p.fk_cerveza = c.clave
        JOIN inventario_tienda it ON it.fk_presentacion = p.clave
        WHERE p.ean_13 = p_ean AND it.fk_tienda_fisica = p_tienda_id
    ) t;
    RETURN producto_json;
END;
$$;

-- 8. Obtener datos completos de una venta
CREATE OR REPLACE FUNCTION obtener_venta_completa(p_venta_id INT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    venta_completa JSON;
BEGIN
    SELECT json_build_object(
        'venta', (SELECT row_to_json(v) FROM venta_tienda_fisica v WHERE v.clave = p_venta_id),
        'cliente', (SELECT row_to_json(c) FROM cliente c JOIN venta_tienda_fisica v ON c.clave = v.fk_cliente WHERE v.clave = p_venta_id),
        'detalle', (
            SELECT json_agg(json_build_object(
                'detalle_id', dv.clave,
                'cantidad', dv.cantidad,
                'precio_unitario', dv.precio_unitario,
                'presentacion_id', p.clave,
                'presentacion_nombre', p.nombre,
                'cerveza_nombre', c.nombre
            ))
            FROM detalle_venta_fisica dv
            JOIN inventario_tienda it ON dv.fk_inventario_tienda = it.clave
            JOIN presentacion p ON it.fk_presentacion = p.clave
            JOIN cerveza c ON p.fk_cerveza = c.clave
            WHERE dv.fk_venta_tienda_fisica = p_venta_id
        ),
        'pagos', (
            SELECT json_agg(json_build_object(
                'pago_id', pa.clave,
                'monto', pa.monto_total,
                'tipo_metodo', mp.tipo,
                'moneda', mp.moneda,
                'banco', mp.banco,
                'tasa_cambio', tc.monto_equivalencia
            ))
            FROM pago pa
            JOIN metodo_de_pago mp ON pa.fk_metodo_de_pago = mp.clave
            LEFT JOIN tasa_cambio tc ON pa.fk_tasa_cambio = tc.clave
            WHERE pa.fk_venta_tienda_fisica = p_venta_id
        )
    ) INTO venta_completa;

    RETURN venta_completa;
END;
$$;

-- 9. Obtener datos completos de una venta ONLINE
CREATE OR REPLACE FUNCTION obtener_venta_online_completa(p_venta_id INT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    venta_completa JSON;
BEGIN
    SELECT json_build_object(
        'venta', (
            SELECT row_to_json(v)
            FROM (
                SELECT vo.*, u.username, c.primer_nombre, c.primer_apellido, c.rif, c.ci
                FROM venta_online vo
                JOIN usuario u ON vo.fk_usuario = u.clave
                LEFT JOIN cliente c ON u.fk_cliente = c.clave
                WHERE vo.clave = p_venta_id
            ) v
        ),
        'detalle', (
            SELECT json_agg(json_build_object(
                'detalle_id', dvo.clave,
                'cantidad', dvo.cantidad,
                'precio_unitario', dvo.precio_unitario,
                'presentacion_id', p.clave,
                'presentacion_nombre', p.nombre,
                'cerveza_nombre', c.nombre,
                'ean_13', p.ean_13
            ))
            FROM detalle_venta_online dvo
            JOIN almacen a ON dvo.fk_almacen = a.clave
            JOIN presentacion p ON a.fk_presentacion = p.clave
            JOIN cerveza c ON p.fk_cerveza = c.clave
            WHERE dvo.fk_venta_online = p_venta_id
        ),
        'pagos', (
            SELECT json_agg(json_build_object(
                'pago_id', pa.clave,
                'monto', pa.monto_total,
                'tipo_metodo', mp.tipo,
                'moneda', mp.moneda,
                'banco', mp.banco,
                'tasa_cambio', tc.monto_equivalencia
            ))
            FROM pago pa
            JOIN metodo_de_pago mp ON pa.fk_metodo_de_pago = mp.clave
            LEFT JOIN tasa_cambio tc ON pa.fk_tasa_cambio = tc.clave
            WHERE pa.fk_venta_online = p_venta_id
        )
    ) INTO venta_completa;

    RETURN venta_completa;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA REPOSICIONES
-- =============================================

-- 1. Obtener todas las reposiciones con detalles
CREATE OR REPLACE FUNCTION obtener_reposiciones_con_detalles()
RETURNS TABLE (
    clave INT,
    fk_almacen INT,
    fk_inventario_tienda INT,
    fk_usuario INT,
    cantidad INT,
    fecha DATE,
    estado_actual VARCHAR(50),
    fecha_ultimo_cambio TIMESTAMP,
    comentario_ultimo TEXT,
    producto_nombre VARCHAR(50),
    presentacion_nombre VARCHAR(50),
    stock_actual INT,
    tienda_nombre VARCHAR(50),
    usuario_responsable VARCHAR(50),
    jefe_pasillo VARCHAR(50),
    urgencia VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.clave,
        r.fk_almacen,
        r.fk_inventario_tienda,
        r.fk_usuario,
        r.cantidad,
        r.fecha,
        e.estado as estado_actual,
        h.fecha as fecha_ultimo_cambio,
        h.comentario as comentario_ultimo,
        c.nombre as producto_nombre,
        p.nombre as presentacion_nombre,
        it.cantidad as stock_actual,
        tf.nombre as tienda_nombre,
        u.username as usuario_responsable,
        CAST(COALESCE(
            (emp.primer_nombre || ' ' || emp.primer_apellido),
            cl.primer_nombre || ' ' || cl.primer_apellido,
            mem.razon_social
        ) AS VARCHAR(50)) as jefe_pasillo,
        CAST(CASE 
            WHEN it.cantidad <= 5 THEN 'Crítico'
            WHEN it.cantidad <= 10 THEN 'Urgente'
            WHEN it.cantidad <= 20 THEN 'Moderado'
            ELSE 'Normal'
        END AS VARCHAR(20)) as urgencia
    FROM reposicion r
    LEFT JOIN (
        SELECT DISTINCT ON (h_sub.fk_reposicion) 
            h_sub.fk_reposicion, h_sub.fk_estatus, h_sub.fecha, h_sub.comentario
        FROM historico h_sub
        WHERE h_sub.fk_reposicion IS NOT NULL
        ORDER BY h_sub.fk_reposicion, h_sub.fecha DESC
    ) h ON r.clave = h.fk_reposicion
    LEFT JOIN estatus e ON h.fk_estatus = e.clave
    JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
    JOIN presentacion p ON it.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    JOIN tienda_fisica tf ON it.fk_tienda_fisica = tf.clave
    JOIN usuario u ON r.fk_usuario = u.clave
    LEFT JOIN empleado emp ON u.fk_empleado = emp.ci
    LEFT JOIN cliente cl ON u.fk_cliente = cl.clave
    LEFT JOIN miembro mem ON u.fk_miembro = mem.rif
    ORDER BY r.fecha DESC, urgencia;
END;
$$;

-- 2. Obtener reposiciones por tienda específica
CREATE OR REPLACE FUNCTION obtener_reposiciones_por_tienda(p_tienda_id INT)
RETURNS TABLE (
    clave INT,
    fk_almacen INT,
    fk_inventario_tienda INT,
    fk_usuario INT,
    cantidad INT,
    fecha DATE,
    estado_actual VARCHAR(50),
    fecha_ultimo_cambio TIMESTAMP,
    comentario_ultimo TEXT,
    producto_nombre VARCHAR(50),
    presentacion_nombre VARCHAR(50),
    stock_actual INT,
    usuario_responsable VARCHAR(50),
    urgencia VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.clave,
        r.fk_almacen,
        r.fk_inventario_tienda,
        r.fk_usuario,
        r.cantidad,
        r.fecha,
        e.estado as estado_actual,
        h.fecha as fecha_ultimo_cambio,
        h.comentario as comentario_ultimo,
        c.nombre as producto_nombre,
        p.nombre as presentacion_nombre,
        it.cantidad as stock_actual,
        u.username as usuario_responsable,
        CAST(CASE 
            WHEN it.cantidad <= 5 THEN 'Crítico'
            WHEN it.cantidad <= 10 THEN 'Urgente'
            WHEN it.cantidad <= 20 THEN 'Moderado'
            ELSE 'Normal'
        END AS VARCHAR(20)) as urgencia
    FROM reposicion r
    LEFT JOIN (
        SELECT DISTINCT ON (h_sub.fk_reposicion) 
            h_sub.fk_reposicion, h_sub.fk_estatus, h_sub.fecha, h_sub.comentario
        FROM historico h_sub
        WHERE h_sub.fk_reposicion IS NOT NULL
        ORDER BY h_sub.fk_reposicion, h_sub.fecha DESC
    ) h ON r.clave = h.fk_reposicion
    LEFT JOIN estatus e ON h.fk_estatus = e.clave
    JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
    JOIN presentacion p ON it.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    JOIN usuario u ON r.fk_usuario = u.clave
    WHERE it.fk_tienda_fisica = p_tienda_id
    ORDER BY r.fecha DESC, urgencia;
END;
$$;

-- 3. Obtener una reposición específica por ID
CREATE OR REPLACE FUNCTION obtener_reposicion_por_id(p_reposicion_id INT)
RETURNS TABLE (
    clave INT,
    fk_almacen INT,
    fk_inventario_tienda INT,
    fk_usuario INT,
    cantidad INT,
    fecha DATE,
    estado_actual VARCHAR(50),
    historial_estados JSON,
    producto_nombre VARCHAR(50),
    presentacion_nombre VARCHAR(50),
    stock_actual INT,
    tienda_nombre VARCHAR(50),
    usuario_responsable VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.clave,
        r.fk_almacen,
        r.fk_inventario_tienda,
        r.fk_usuario,
        r.cantidad,
        r.fecha,
        e_actual.estado as estado_actual,
        (
            SELECT json_agg(
                json_build_object(
                    'estado', e.estado,
                    'fecha', h.fecha,
                    'comentario', h.comentario
                ) ORDER BY h.fecha DESC
            )
            FROM historico h
            JOIN estatus e ON h.fk_estatus = e.clave
            WHERE h.fk_reposicion = r.clave
        ) as historial_estados,
        c.nombre as producto_nombre,
        p.nombre as presentacion_nombre,
        it.cantidad as stock_actual,
        tf.nombre as tienda_nombre,
        u.username as usuario_responsable
    FROM reposicion r
    LEFT JOIN (
        SELECT DISTINCT ON (fk_reposicion) 
            fk_reposicion, fk_estatus
        FROM historico 
        WHERE fk_reposicion IS NOT NULL
        ORDER BY fk_reposicion, fecha DESC
    ) h_actual ON r.clave = h_actual.fk_reposicion
    LEFT JOIN estatus e_actual ON h_actual.fk_estatus = e_actual.clave
    JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
    JOIN presentacion p ON it.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    JOIN tienda_fisica tf ON it.fk_tienda_fisica = tf.clave
    JOIN usuario u ON r.fk_usuario = u.clave
    WHERE r.clave = p_reposicion_id;
END;
$$;

-- 4. Actualizar estado de reposición (solo jefes de pasillo)
CREATE OR REPLACE FUNCTION actualizar_estado_reposicion(
    p_reposicion_id INT,
    p_nuevo_estado_id INT,
    p_comentario TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    usuario_actual_id INTEGER;
    es_jefe_pasillo BOOLEAN := FALSE;
    es_administrador BOOLEAN := FALSE;
    tienda_reposicion INT;
    tienda_usuario INT;
BEGIN
    -- Obtener el ID del usuario actual desde la variable de sesión
    usuario_actual_id := NULLIF(current_setting('app.current_user_id', true), '')::INTEGER;
    
    IF usuario_actual_id IS NULL OR usuario_actual_id <= 0 THEN
        RAISE EXCEPTION 'Usuario no identificado. No se puede actualizar el estado de la reposición.';
    END IF;
    
    -- Verificar si el usuario es administrador
    SELECT EXISTS (
        SELECT 1
        FROM usuario u
        JOIN rol r ON r.clave = u.fk_rol
        WHERE u.clave = usuario_actual_id
        AND r.nombre = 'Administrador'
    ) INTO es_administrador;
    
    -- Si es administrador, permitir la operación
    IF es_administrador THEN
        INSERT INTO historico (fecha, fk_estatus, fk_reposicion, comentario)
        VALUES (NOW(), p_nuevo_estado_id, p_reposicion_id, p_comentario);
        RETURN TRUE;
    END IF;
    
    -- Verificar si el usuario tiene el rol de jefe de pasillo
    SELECT EXISTS (
        SELECT 1
        FROM usuario u
        JOIN rol r ON r.clave = u.fk_rol
        WHERE u.clave = usuario_actual_id
        AND r.nombre = 'Jefe de Pasillo'
    ) INTO es_jefe_pasillo;
    
    IF NOT es_jefe_pasillo THEN
        RAISE EXCEPTION 'Acceso denegado: Solo los jefes de pasillo pueden modificar el estado de las reposiciones. Usuario ID: %', usuario_actual_id;
    END IF;
    
    -- Obtener la tienda de la reposición
    SELECT it.fk_tienda_fisica INTO tienda_reposicion
    FROM reposicion r
    JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
    WHERE r.clave = p_reposicion_id;
    
    -- Obtener la tienda del usuario (a través de su contrato activo)
    SELECT d.fk_tienda_fisica INTO tienda_usuario
    FROM usuario u
    JOIN empleado e ON u.fk_empleado = e.ci
    JOIN contrato c ON e.ci = c.fk_empleado
    JOIN departamento d ON c.fk_departamento = d.clave
    WHERE u.clave = usuario_actual_id
    AND c.fecha_fin IS NULL; -- Contrato activo
    
    -- Verificar que el jefe de pasillo pertenece a la misma tienda
    IF tienda_usuario != tienda_reposicion THEN
        RAISE EXCEPTION 'Acceso denegado: Solo puede modificar reposiciones de su tienda asignada. Tienda usuario: %, Tienda reposición: %', tienda_usuario, tienda_reposicion;
    END IF;
    
    -- Insertar el nuevo estado en el histórico
    INSERT INTO historico (fecha, fk_estatus, fk_reposicion, comentario)
    VALUES (NOW(), p_nuevo_estado_id, p_reposicion_id, p_comentario);
    
    RETURN TRUE;
END;
$$;

-- 5. Obtener jefes de pasillo por tienda
CREATE OR REPLACE FUNCTION obtener_jefes_pasillo_por_tienda(p_tienda_id INT)
RETURNS TABLE (
    usuario_id INT,
    username VARCHAR(50),
    nombre_completo TEXT,
    telefono TEXT,
    email VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.clave as usuario_id,
        u.username,
        (e.primer_nombre || ' ' || e.primer_apellido)::TEXT as nombre_completo,
        CONCAT(t.codigo, '-', t.numero)::TEXT as telefono,
        ce.direccion_email as email
    FROM usuario u
    JOIN rol r ON u.fk_rol = r.clave
    JOIN empleado e ON u.fk_empleado = e.ci
    JOIN contrato c ON e.ci = c.fk_empleado
    JOIN departamento d ON c.fk_departamento = d.clave
    LEFT JOIN telefono t ON e.ci = t.fk_empleado
    LEFT JOIN correo_electronico ce ON e.ci = ce.fk_empleado
    WHERE r.nombre = 'Jefe de Pasillo'
    AND d.fk_tienda_fisica = p_tienda_id
    AND c.fecha_fin IS NULL; -- Solo contratos activos
END;
$$;

-- 6. Crear reposición manual
CREATE OR REPLACE FUNCTION crear_reposicion_manual(
    p_inventario_tienda_id INT,
    p_cantidad INT,
    p_usuario_id INT,
    p_comentario TEXT DEFAULT NULL
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_almacen_id INT;
    v_reposicion_id INT;
    v_estado_procesando_id INT;
BEGIN
    -- Obtener el almacén correspondiente a la presentación
    SELECT a.clave INTO v_almacen_id
    FROM inventario_tienda it
    JOIN presentacion p ON it.fk_presentacion = p.clave
    JOIN almacen a ON a.fk_presentacion = p.clave
    WHERE it.clave = p_inventario_tienda_id;
    
    IF v_almacen_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el almacén correspondiente para el inventario de tienda ID: %', p_inventario_tienda_id;
    END IF;
    
    -- Crear la reposición
    INSERT INTO reposicion (fk_almacen, fk_inventario_tienda, fk_usuario, cantidad, fecha)
    VALUES (v_almacen_id, p_inventario_tienda_id, p_usuario_id, p_cantidad, CURRENT_DATE)
    RETURNING clave INTO v_reposicion_id;
    
    -- Obtener el ID del estado 'procesando' para reposición
    SELECT clave INTO v_estado_procesando_id
    FROM estatus 
    WHERE estado = 'procesando' AND aplicable_a = 'reposicion'
    LIMIT 1;
    
    -- Insertar el estado inicial en el histórico
    INSERT INTO historico (fecha, fk_estatus, fk_reposicion, comentario)
    VALUES (NOW(), v_estado_procesando_id, v_reposicion_id, COALESCE(p_comentario, 'Reposición creada manualmente'));
    
    RETURN v_reposicion_id;
END;
$$;

-- 7. Obtener estadísticas de reposiciones
CREATE OR REPLACE FUNCTION obtener_estadisticas_reposiciones(p_tienda_id INT DEFAULT NULL)
RETURNS TABLE (
    total_reposiciones BIGINT,
    pendientes BIGINT,
    en_proceso BIGINT,
    completadas BIGINT,
    criticas BIGINT,
    promedio_tiempo_procesamiento TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH reposiciones_filtradas AS (
        SELECT r.clave, r.fecha as fecha_reposicion, it.cantidad as stock_actual,
               (SELECT e.estado 
                FROM historico h
                JOIN estatus e ON h.fk_estatus = e.clave
                WHERE h.fk_reposicion = r.clave
                ORDER BY h.fecha DESC
                LIMIT 1) as estado_actual
        FROM reposicion r
        JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
        WHERE (p_tienda_id IS NULL OR it.fk_tienda_fisica = p_tienda_id)
    )
    SELECT 
        COUNT(*) as total_reposiciones,
        COUNT(*) FILTER (WHERE estado_actual = 'procesando') as pendientes,
        COUNT(*) FILTER (WHERE estado_actual = 'listo para entrega') as en_proceso,
        COUNT(*) FILTER (WHERE estado_actual = 'entregado') as completadas,
        COUNT(*) FILTER (WHERE stock_actual <= 5) as criticas,
        COALESCE(
            floor(
                extract(epoch from avg(age(now()::date, fecha_reposicion))) / 86400
            )::text || ' días', 
            'N/A'
        ) as promedio_tiempo_procesamiento
    FROM reposiciones_filtradas;
END;
$$;

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
    v_usuario_jefe_pasillo_id INT;
    v_reposicion_id INT;
    v_estado_procesando_id INT;
    v_tienda_id INT;
BEGIN
    -- Si la cantidad cruza el umbral de 20 unidades (y no es una inserción inicial)
    IF NEW.cantidad <= 20 AND (TG_OP = 'INSERT' OR OLD.cantidad > 20) THEN
        -- Obtener la tienda física asociada
        v_tienda_id := NEW.fk_tienda_fisica;
        
        -- Obtener el almacén correspondiente a la presentación
        SELECT a.clave INTO v_almacen_id
        FROM almacen a
        WHERE a.fk_presentacion = NEW.fk_presentacion;
        
        -- Obtener un jefe de pasillo de la tienda correspondiente
        SELECT u.clave INTO v_usuario_jefe_pasillo_id
        FROM usuario u
        JOIN rol r ON r.clave = u.fk_rol
        JOIN empleado e ON u.fk_empleado = e.ci
        JOIN contrato c ON e.ci = c.fk_empleado
        JOIN departamento d ON c.fk_departamento = d.clave
        WHERE r.nombre = 'Jefe de Pasillo'
        AND d.fk_tienda_fisica = v_tienda_id
        AND c.fecha_fin IS NULL -- Contrato activo
        LIMIT 1;
        
        -- Si no hay jefe de pasillo, buscar un administrador como fallback
        IF v_usuario_jefe_pasillo_id IS NULL THEN
            SELECT u.clave INTO v_usuario_jefe_pasillo_id
            FROM usuario u
            JOIN rol r ON r.clave = u.fk_rol
            WHERE r.nombre = 'Administrador'
            LIMIT 1;
        END IF;
        
        IF v_almacen_id IS NULL OR v_usuario_jefe_pasillo_id IS NULL THEN
            RAISE EXCEPTION 'No se encontró el almacén (%) o jefe de pasillo (%) correspondiente para la reposición en tienda %', 
                v_almacen_id, v_usuario_jefe_pasillo_id, v_tienda_id;
        END IF;
        
        -- Verificar que no existe ya una reposición pendiente para este producto en esta tienda
        IF EXISTS (
            SELECT 1 
            FROM reposicion r
            JOIN historico h ON r.clave = h.fk_reposicion
            JOIN estatus e ON h.fk_estatus = e.clave
            WHERE r.fk_inventario_tienda = NEW.clave
            AND e.estado IN ('procesando', 'listo para entrega')
        ) THEN
            -- Ya existe una reposición pendiente, no crear otra
            RETURN NEW;
        END IF;
        
        -- Crear nueva reposición (cantidad estándar de 100 unidades)
        INSERT INTO reposicion (fk_almacen, fk_inventario_tienda, fk_usuario, cantidad, fecha)
        VALUES (v_almacen_id, NEW.clave, v_usuario_jefe_pasillo_id, 100, CURRENT_DATE)
        RETURNING clave INTO v_reposicion_id;
        
        -- Obtener el ID del estado 'procesando' para reposición
        SELECT clave INTO v_estado_procesando_id
        FROM estatus 
        WHERE estado = 'procesando' AND aplicable_a = 'reposicion' 
        LIMIT 1;
        
        -- Insertar el primer estado en histórico
        INSERT INTO historico (fecha, fk_estatus, fk_reposicion, comentario)
        VALUES (CURRENT_TIMESTAMP, v_estado_procesando_id, v_reposicion_id, 
                'Reposición automática generada - Stock bajo: ' || NEW.cantidad || ' unidades');
        
        -- Log para debugging
        RAISE NOTICE 'Reposición automática creada: ID %, Producto: %, Stock: %, Tienda: %', 
            v_reposicion_id, NEW.fk_presentacion, NEW.cantidad, v_tienda_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_generar_orden_reposicion
AFTER INSERT OR UPDATE ON inventario_tienda
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
        AND tipo = 'Tarjeta de credito' OR tipo = 'Puntos'
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




/*
-- Trigger para validar el pago de orden de compra
CREATE OR REPLACE FUNCTION validar_pago_compra()
RETURNS TRIGGER AS $$
DECLARE
    fecha_entregado DATE;
BEGIN
    -- Obtener la fecha cuando se marcó como entregado
    SELECT h.fecha INTO fecha_entregado
    FROM historico h
    JOIN estatus e ON e.clave = h.fk_estatus
    WHERE h.fk_compra = NEW.fk_compra
    AND e.estado = 'entregado'
    AND e.aplicable_a = 'compra'
    ORDER BY h.fecha DESC
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
*/

-- Trigger para descontar puntos cuando se paga con puntos
CREATE OR REPLACE FUNCTION descontar_puntos_cliente()
RETURNS TRIGGER AS $$
DECLARE
    v_cliente_id INT;
    v_puntos_usados INT;
    v_puntos_disponibles INT;
    v_tasa_puntos DECIMAL;
BEGIN
    -- Verificar si el método de pago es de tipo 'Puntos'
    IF EXISTS (
        SELECT 1 FROM metodo_de_pago 
        WHERE clave = NEW.fk_metodo_de_pago 
        AND tipo = 'Puntos'
    ) THEN
        -- Obtener el cliente según el tipo de venta
        IF NEW.fk_venta_tienda_fisica IS NOT NULL THEN
            -- Venta física
            SELECT fk_cliente INTO v_cliente_id
            FROM venta_tienda_fisica 
            WHERE clave = NEW.fk_venta_tienda_fisica;
        ELSIF NEW.fk_venta_online IS NOT NULL THEN
            -- Venta online - obtener cliente a través del usuario
            SELECT c.clave INTO v_cliente_id
            FROM venta_online vo
            JOIN usuario u ON u.clave = vo.fk_usuario
            JOIN cliente c ON c.clave = u.fk_cliente
            WHERE vo.clave = NEW.fk_venta_online;
        ELSIF NEW.fk_venta_evento IS NOT NULL THEN
            -- Venta de evento - obtener cliente directamente (no tiene fk_usuario)
            SELECT fk_cliente INTO v_cliente_id
            FROM venta_evento 
            WHERE clave = NEW.fk_venta_evento;
        ELSIF NEW.fk_venta_entrada IS NOT NULL THEN
            -- Venta de entrada - puede tener fk_cliente directo o fk_usuario
            SELECT COALESCE(vent.fk_cliente, c.clave) INTO v_cliente_id
            FROM venta_entrada vent
            LEFT JOIN usuario u ON u.clave = vent.fk_usuario
            LEFT JOIN cliente c ON c.clave = u.fk_cliente
            WHERE vent.clave = NEW.fk_venta_entrada;
        END IF;
        
        -- Verificar que se encontró el cliente
        IF v_cliente_id IS NULL THEN
            RAISE EXCEPTION 'No se encontró el cliente para la venta';
        END IF;
        
        -- Obtener la tasa de cambio de puntos
        SELECT monto_equivalencia INTO v_tasa_puntos
        FROM tasa_cambio 
        WHERE clave = NEW.fk_tasa_cambio;
        
        -- Verificar que se encontró la tasa de cambio
        IF v_tasa_puntos IS NULL THEN
            RAISE EXCEPTION 'No se encontró la tasa de cambio para el pago';
        END IF;
        
        -- Calcular puntos necesarios
        v_puntos_usados := CEIL(NEW.monto_total / v_tasa_puntos);
        
        -- Obtener puntos disponibles del cliente
        SELECT puntos_acumulados INTO v_puntos_disponibles
        FROM cliente 
        WHERE clave = v_cliente_id;
        
        -- Verificar que el cliente tenga suficientes puntos
        IF v_puntos_disponibles < v_puntos_usados THEN
            RAISE EXCEPTION 'Cliente ID % no tiene suficientes puntos. Necesita: %, Tiene disponible: %', 
                v_cliente_id, v_puntos_usados, v_puntos_disponibles;
        END IF;
        
        -- Descontar puntos del cliente
        UPDATE cliente 
        SET puntos_acumulados = puntos_acumulados - v_puntos_usados
        WHERE clave = v_cliente_id;
        
        -- Mostrar información del descuento (para debugging)
        RAISE NOTICE 'Puntos descontados: Cliente ID %, Puntos usados: %, Monto: %, Tasa: %', 
            v_cliente_id, v_puntos_usados, NEW.monto_total, v_tasa_puntos;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_descontar_puntos_cliente
AFTER INSERT ON pago
FOR EACH ROW
EXECUTE FUNCTION descontar_puntos_cliente();

-- Trigger para validar que solo el jefe de pasillo pueda cambiar el estatus de una reposición
CREATE OR REPLACE FUNCTION validar_cambio_estatus_reposicion()
RETURNS TRIGGER AS $$
DECLARE
    usuario_actual_id INTEGER;
    es_jefe_pasillo BOOLEAN := FALSE;
    es_administrador BOOLEAN := FALSE;
    tienda_reposicion INT;
    tienda_usuario INT;
BEGIN
    -- Solo validar si es una reposición
    IF NEW.fk_reposicion IS NOT NULL THEN
        -- Obtener el ID del usuario actual desde la variable de sesión
        usuario_actual_id := NULLIF(current_setting('app.current_user_id', true), '')::INTEGER;
        
        -- Si tenemos un usuario identificado, verificar sus permisos
        IF usuario_actual_id IS NOT NULL AND usuario_actual_id > 0 THEN
            -- Verificar si el usuario es administrador
            SELECT EXISTS (
                SELECT 1
                FROM usuario u
                JOIN rol r ON r.clave = u.fk_rol
                WHERE u.clave = usuario_actual_id
                AND r.nombre = 'Administrador'
            ) INTO es_administrador;
            
            -- Si es administrador, permitir la operación
            IF es_administrador THEN
                RETURN NEW;
            END IF;
            
            -- Verificar si el usuario tiene el rol de jefe de pasillo
            SELECT EXISTS (
                SELECT 1
                FROM usuario u
                JOIN rol r ON r.clave = u.fk_rol
                WHERE u.clave = usuario_actual_id
                AND r.nombre = 'Jefe de Pasillo'
            ) INTO es_jefe_pasillo;
            
            -- Si no es jefe de pasillo, lanzar excepción
            IF NOT es_jefe_pasillo THEN
                RAISE EXCEPTION 'Acceso denegado: Solo los jefes de pasillo pueden cambiar el estado de las reposiciones. Usuario ID: %', 
                    usuario_actual_id;
            END IF;
            
            -- Obtener la tienda de la reposición
            SELECT it.fk_tienda_fisica INTO tienda_reposicion
            FROM reposicion r
            JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
            WHERE r.clave = NEW.fk_reposicion;
            
            -- Obtener la tienda del usuario (a través de su contrato activo)
            SELECT d.fk_tienda_fisica INTO tienda_usuario
            FROM usuario u
            JOIN empleado e ON u.fk_empleado = e.ci
            JOIN contrato c ON e.ci = c.fk_empleado
            JOIN departamento d ON c.fk_departamento = d.clave
            WHERE u.clave = usuario_actual_id
            AND c.fecha_fin IS NULL; -- Contrato activo
            
            -- Verificar que el jefe de pasillo pertenece a la misma tienda
            IF tienda_usuario IS NULL OR tienda_usuario != tienda_reposicion THEN
                RAISE EXCEPTION 'Acceso denegado: Solo puede modificar reposiciones de su tienda asignada. Tienda usuario: %, Tienda reposición: %', 
                    tienda_usuario, tienda_reposicion;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- TRIGGER PARA ACTUALIZAR TASAS DE CAMBIO
-- =================================================================
-- Este trigger se dispara ANTES de cada operación de INSERT en la
-- tabla tasa_cambio.
-- Llama a la función actualizar_tasa_cambio_anterior() para asegurar
-- que solo haya una tasa activa por moneda.

-- Primero, eliminamos el trigger si ya existe para evitar errores
DROP TRIGGER IF EXISTS trg_actualizar_tasa_anterior ON tasa_cambio;

-- Luego, creamos el nuevo trigger
CREATE TRIGGER trg_actualizar_tasa_anterior
BEFORE INSERT ON tasa_cambio
FOR EACH ROW
EXECUTE FUNCTION actualizar_tasa_cambio_anterior();

-- =================================================================
-- EJEMPLO DE USO:
-- =================================================================
-- Cuando insertes una nueva tasa, por ejemplo:
--
-- INSERT INTO tasa_cambio (moneda, monto_equivalencia, fecha_inicio)
-- VALUES ('USD', 36.50, '2023-10-27');
--
-- El trigger se asegurará de que la tasa 'USD' anterior que tenía
-- fecha_fin = NULL ahora tenga fecha_fin = '2023-10-26 23:59:59'.
-- =================================================================

COMMENT ON FUNCTION actualizar_tasa_cambio_anterior IS 'Función del trigger para cerrar la vigencia de una tasa de cambio anterior al insertar una nueva para la misma moneda.';
COMMENT ON TRIGGER trg_actualizar_tasa_anterior ON tasa_cambio IS 'Trigger que se activa antes de insertar una nueva tasa para actualizar la fecha de fin de la tasa anterior activa.'; 
