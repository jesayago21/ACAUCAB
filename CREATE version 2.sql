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
    hora_inicio TIME,
    direccion TEXT NOT NULL,
    precio_entrada INT,
    fk_evento INT,
    fk_lugar INT NOT NULL,
    fk_tipo_evento INT NOT NULL,
    CONSTRAINT pk_evento PRIMARY KEY (clave),
    CONSTRAINT fk_evento_evento FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT fk_lugar_evento FOREIGN KEY (fk_lugar) REFERENCES lugar(clave),
    CONSTRAINT fk_tipo_evento_evento FOREIGN KEY (fk_tipo_evento) REFERENCES tipo_evento(clave),
    CONSTRAINT chk_fecha_evento CHECK (fecha_inicio <= fecha_fin)
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
    CONSTRAINT chk_cantidad_unidades CHECK (cantidad_unidades >= 0)--creo que no podia llegar a 0 jamas
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
    monto_total DECIMAL(10,2) NOT NULL,
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
    fk_empleado INT NOT NULL,
    CONSTRAINT pk_venta_tienda_fisica PRIMARY KEY (clave), 
    CONSTRAINT fk_tienda_fisica_venta_tienda_fisica FOREIGN KEY (fk_tienda_fisica) REFERENCES tienda_fisica(clave),
    CONSTRAINT fk_cliente_venta_tienda_fisica FOREIGN KEY (fk_cliente) REFERENCES cliente(clave),
    CONSTRAINT fk_empleado_venta_tienda_fisica FOREIGN KEY (fk_empleado) REFERENCES empleado(ci),
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