/* Tablas creadas, cheqquear en:
https://www.canva.com/design/DAGqE0e9XEM/PXLuCVMecbLF0AXxoVMUxw/edit?utm_content=DAGqE0e9XEM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
*/

CREATE TABLE lugar (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    fk_lugar INT,
    CONSTRAINT pk_lugar PRIMARY KEY (clave),
    CONSTRAINT fk_lugar_lugar FOREIGN KEY (fk_lugar) REFERENCES lugar(clave),
    CONSTRAINT chk_tipo_lugar CHECK (tipo IN ('estado', 'municipio', 'parroquia'))
);


CREATE TABLE tipo_cerveza (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT,
    historia TEXT,
    fk_tipo_cerveza INT NOT NULL,
    fk_receta INT NOT NULL,
    CONSTRAINT pk_tipo_cerveza PRIMARY KEY (clave),
    CONSTRAINT fk_tipo_cerveza_tipo_cerveza FOREIGN KEY (fk_tipo_cerveza) REFERENCES tipo_cerveza(clave),
    CONSTRAINT fk_receta_tipo_cerveza FOREIGN KEY (fk_receta) REFERENCES receta(clave),
    CONSTRAINT uq_tipo_cerveza UNIQUE (fk_receta)
);

CREATE TABLE cerveza (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    grado_alcohol INT NOT NULL,
    fk_tipo_cerveza INT NOT NULL,
    fk_receta INT NOT NULL,
    fk_miembro INT NOT NULL,
    CONSTRAINT pk_cerveza PRIMARY KEY (clave),
    CONSTRAINT fk_tipo_cerveza_cerveza FOREIGN KEY (fk_tipo_cerveza) REFERENCES tipo_cerveza(clave),
    CONSTRAINT fk_receta_cerveza FOREIGN KEY (fk_receta) REFERENCES receta(clave),
    CONSTRAINT fk_miembro_cerveza FOREIGN KEY (fk_miembro) REFERENCES miembro(rif),
    CONSTRAINT uq_cerveza UNIQUE (fk_receta)
);

CREATE TABLE presentacion (
    clave SERIAL,
    EAN_13 BIGINT NOT NULL,
    nombre VARCHAR (50) NOT NULL,
    cantidad_unidades INT NOT NULL,
    fk_cerveza INT NOT NULL,
    CONSTRAINT pk_presentacion PRIMARY KEY (clave),
    CONSTRAINT fk_cerveza_presentacion FOREIGN KEY (fk_cerveza) REFERENCES cerveza(clave), 
    CONSTRAINT chk_ean_13 CHECK (EAN_13 > 0 AND EAN_13 < 10000000000000),
    CONSTRAINT chk_cantidad_unidades CHECK (cantidad_unidades > 0)
);

CREATE TABLE oferta (
    clave SERIAL,
    porcentaje_descuento INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL, 
    fk_presentacion INT NOT NULL,
    CONSTRAINT pk_oferta1 PRIMARY KEY (clave),
    CONSTRAINT pk_oferta2 PRIMARY KEY (fk_presentacion),
    CONSTRAINT fk_presentacion_oferta FOREIGN KEY (fk_presentacion) REFERENCES presentacion(clave),
    CONSTRAINT chk_fecha_oferta CHECK (fecha_inicio < fecha_fin),
    CONSTRAINT chk_porcentaje_oferta CHECK (porcentaje_descuento > 0 AND porcentaje_descuento <= 100),
);

CREATE TABLE ingrediente (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT pk_ingrediente PRIMARY KEY (clave)
);

CREATE TABLE receta (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT pk_receta PRIMARY KEY (clave)
);

-- TABLA N:N duda?
CREATE TABLE ing_cer(
    clave SERIAL,
    cantidad DECIMAL(10,2) NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    fk_receta INT NOT NULL,
    fk_ingrediente INT NOT NULL,
    CONSTRAINT pk_ing_cer PRIMARY KEY (clave),
    CONSTRAINT fk_receta_ing_cer FOREIGN KEY (fk_receta) REFERENCES receta(clave),
    CONSTRAINT fk_ingrediente_ing_cer FOREIGN KEY (fk_ingrediente) REFERENCES ingrediente(clave)
);
-----------------------------

CREATE TABLE instruccion (
    clave SERIAL,
    numero_paso VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    fk_ing_cer INT NOT NULL,
    CONSTRAINT pk_instruccion PRIMARY KEY (clave),
    CONSTRAINT fk_ing_cer_instruccion FOREIGN KEY (fk_ing_cer) REFERENCES ing_cer(clave)
);

CREATE TABLE caracteristica (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    CONSTRAINT pk_caracteristica PRIMARY KEY (clave)
);

CREATE TABLE car_cer (
    clave SERIAL,
    descripcion TEXT,
    valor INT,
    fk_caracteristica INT NOT NULL,
    fk_cerveza INT NOT NULL,
    CONSTRAINT pk_car_cer PRIMARY KEY (clave),
    CONSTRAINT fk_caracteristica_car_cer FOREIGN KEY (fk_caracteristica) REFERENCES caracteristica(clave),
    CONSTRAINT fk_cerveza_car_cer FOREIGN KEY (fk_cerveza) REFERENCES cerveza(clave)
);

CREATE TABLE car_tip (
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

-- EVENTOS

CREATE TABLE tipo_evento (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT pk_tipo_evento PRIMARY KEY (clave)
);

CREATE TABLE tipo_invitado (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    CONSTRAINT pk_tipo_invitado PRIMARY KEY (clave)
);

CREATE TABLE invitado (
    ci SERIAL,
    rif INT NOT NULL,
    primer_nombre VARCHAR (50) NOT NULL,
    primer_apellido VARCHAR (50) NOT NULL,
    fk_tipo_invitado INT NOT NULL,
    CONSTRAINT pk_invitado PRIMARY KEY (ci),
    CONSTRAINT fk_tipo_invitado_invitado FOREIGN KEY (fk_tipo_invitado) REFERENCES tipo_invitado(clave)
);

CREATE TABLE evento (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    direccion TEXT NOT NULL,
    precio_entrada INT,
    fk_evento INT NOT NULL,
    fk_lugar INT NOT NULL,
    fk_tipo_evento INT NOT NULL,
    CONSTRAINT pk_evento PRIMARY KEY (clave),
    CONSTRAINT fk_tipo_evento FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT fk_lugar_evento FOREIGN KEY (fk_lugar) REFERENCES lugar(clave),
    CONSTRAINT fk_tipo_evento_evento FOREIGN KEY (fk_tipo_evento) REFERENCES tipo_evento(clave)
);

CREATE TABLE inv_eve (
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

-- MIEMBROS

CREATE TABLE miembro (
    rif INT NOT NULL,
    razon_social VARCHAR (50) NOT NULL,
    denominacion_comercial VARCHAR (50),
    direccion_fiscal VARCHAR (255) NOT NULL,
    direccion_fisica VARCHAR (255) NOT NULL,
    fecha_afiliacion DATE NOT NULL,
    fk_lugar_1 INT NOT NULL,
    fk_lugar_2 INT NOT NULL,
    CONSTRAINT pk_miembro PRIMARY KEY (rif),
    CONSTRAINT fk_lugar_miembro_1 FOREIGN KEY (fk_lugar_1) REFERENCES lugar(clave),
    CONSTRAINT fk_lugar_miembro_2 FOREIGN KEY (fk_lugar_2) REFERENCES lugar(clave) 
);

CREATE TABLE eve_mie (
    clave SERIAL,
    descripcion_participacion TEXT,
    fk_miembro INT NOT NULL,
    fk_evento INT NOT NULL,
    CONSTRAINT pk_eve_mie PRIMARY KEY (clave),
    CONSTRAINT fk_miembro_eve_mie FOREIGN KEY (fk_miembro) REFERENCES miembro(rif),
    CONSTRAINT fk_evento_eve_mie FOREIGN KEY (fk_evento) REFERENCES evento(clave),
    CONSTRAINT uq_eve_mie UNIQUE (fk_miembro, fk_evento)
);

CREATE TABLE cuota (
    clave SERIAL,
    fecha DATE NOT NULL,
    monto INT NOT NULL,
    fk_miembro INT NOT NULL,
    CONSTRAINT pk_cuota PRIMARY KEY (clave),
    CONSTRAINT fk_miembro_cuota FOREIGN KEY (fk_miembro) REFERENCES miembro(rif)
);
CREATE TABLE compra (
    clave SERIAL,
    fecha DATE NOT NULL,
    monto_total INT NOT NULL,
    fk_miembro INT NOT NULL,
    CONSTRAINT pk_compra PRIMARY KEY (clave),
    CONSTRAINT fk_miembro_compra FOREIGN KEY (fk_miembro) REFERENCES miembro(rif)
);

-- EMPLEADOS

CREATE TABLE empleado (
    ci SERIAL,
    primer_nombre VARCHAR (50) NOT NULL,
    segundo_nombre VARCHAR (50),
    primer_apellido VARCHAR (50) NOT NULL,
    segundo_apellido VARCHAR (50),
    fecha_nacimiento DATE NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_empleado PRIMARY KEY (ci)
);

CREATE TABLE tipo_beneficio (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_tipo_beneficio PRIMARY KEY (clave)
);

CREATE TABLE emp_ben (
    clave SERIAL,
    monto INT,
    fk_empleado INT NOT NULL,
    fk_tipo_beneficio INT NOT NULL,
    CONSTRAINT pk_emp_ben PRIMARY KEY (clave),
    CONSTRAINT fk_empleado_emp_ben FOREIGN KEY (fk_empleado) REFERENCES empleado(ci),
    CONSTRAINT fk_tipo_beneficio_emp_ben FOREIGN KEY (fk_tipo_beneficio) REFERENCES tipo_beneficio(clave),
    CONSTRAINT uq_tipo_beneficio UNIQUE (fk_empleado, fk_tipo_beneficio)
);

CREATE TABLE cargo (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT pk_cargo PRIMARY KEY (clave)
);

CREATE TABLE horario (
    clave SERIAL,
    dia VARCHAR(50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    CONSTRAINT pk_horario PRIMARY KEY (clave)
);

CREATE TABLE tienda_fisica (
    clave SERIAL,
    nombre VARCHAR(50) NOT NULL,
    direccion TEXT NOT NULL,
    rif_empresa INT NOT NULL,
    fk_lugar INT NOT NULL,
    CONSTRAINT pk_tienda_fisica PRIMARY KEY (clave),
    CONSTRAINT fk_lugar_tienda_fisica FOREIGN KEY (fk_lugar) REFERENCES lugar(clave)
);

CREATE TABLE departamento (
    clave SERIAL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fk_tienda_fisica INT NOT NULL,
    CONSTRAINT pk_departamento PRIMARY KEY (clave),
    CONSTRAINT fk_tienda_fisica_departamento FOREIGN KEY (fk_tienda_fisica) REFERENCES tienda_fisica(clave)
);

CREATE TABLE contrato (
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

CREATE TABLE control_entrada (
    clave SERIAL,
    fecha_hora_entrada TIMESTAMP,
    fecha_hora_salida TIMESTAMP,
    fk_contrato INT NOT NULL,
    CONSTRAINT pk_control_entrada PRIMARY KEY (clave),
    CONSTRAINT fk_contrato_control_entrada FOREIGN KEY (fk_contrato) REFERENCES contrato(clave)
);

CREATE TABLE vacacion (
    clave SERIAL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    fk_contrato INT NOT NULL,
    CONSTRAINT pk_vacacion PRIMARY KEY (clave),
    CONSTRAINT fk_contrato_vacacion FOREIGN KEY (fk_contrato) REFERENCES contrato(clave)
);

CREATE TABLE con_hor (
    clave SERIAL,
    horario_activo TEXT,
    fk_horario INT NOT NULL,
    fk_contrato INT NOT NULL,
    CONSTRAINT pk_con_hor PRIMARY KEY (clave),
    CONSTRAINT fk_horario_con_hor FOREIGN KEY (fk_horario) REFERENCES horario(clave),
    CONSTRAINT fk_contrato_con_hor FOREIGN KEY (fk_contrato) REFERENCES contrato(clave)
);

CREATE TABLE lugar_tienda (
    clave SERIAL;
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    fk_lugar_tienda INT NOT,
    CONSTRAINT pk_lugar_tienda PRIMARY KEY (clave),
    CONSTRAINT fk_lugar_tienda_lugar_tienda FOREIGN KEY (fk_lugar_tienda) REFERENCES lugar_tienda(clave),
    CONSTRAINT chk_tipo_lugar_tienda CHECK (tipo IN ('zona', 'pasillo', 'anaquel'))
);

CREATE TABLE estatus (   --REVISAR LOS ESTADOS DEL ESTATUS Y EL COÑAZO DE CHECKS
    clave SERIAL,
    estado VARCHAR(50) NOT NULL,
    aplicable_a VARCHAR(50) NOT NULL,
    fk_estatus INT NOT NULL,
    CONSTRAINT pk_estatus PRIMARY KEY (clave),
    CONSTRAINT chk_tipo_estatus CHECK (tipo IN ('compra', 'cuota', 'reposicion', 'venta online'))
);


-- USUARIO

CREATE TABLE rol (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    CONSTRAINT pk_nombre PRIMARY KEY (clave)
);

CREATE TABLE privilegio (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_nombre PRIMARY KEY (clave)
);

CREATE TABLE rol_pri (
    clave SERIAL,
    fecha DATE NOT NULL,
    fk_rol INT NOT NULL,
    fk_privilegio INT NOT NULL,
    CONSTRAINT pk_rol_pri PRIMARY KEY (clave),
    CONSTRAINT fk_rol_rol_pri FOREIGN KEY (fk_rol) REFERENCES rol(clave),
    CONSTRAINT fk_privilegio_rol_pri FOREIGN KEY (fk_privilegio) REFERENCES privilegio(clave)
);

CREATE TABLE inventario_evento (
    clave SERIAL,
    fk_presentacion INT NOT NULL,
    fk_evento INT NOT NULL,
    cantidad_unidades INT NOT NULL,
    CONSTRAINT pk_inventario_evento PRIMARY KEY (clave, fk_presentacion, fk_evento),
    CONSTRAINT fk_presentacion_inventario_evento FOREIGN KEY (fk_presentacion) REFERENCES presentacion(clave),
    CONSTRAINT fk_evento_inventario_evento FOREIGN KEY (fk_evento) REFERENCES evento(clave)
    CONSTRAINT chk_cantidad_unidades CHECK (cantidad_unidades >= 0);--permite que el stock se acabe
);

CREATE TABLE almacen (
    fk_presentacion INT NOT NULL,
    cantidad_unidades INT NOT NULL,
    CONSTRAINT pk_almacen PRIMARY KEY (fk_presentacion),
    CONSTRAINT fk_presentacion_almacen FOREIGN KEY (fk_presentacion) REFERENCES presentacion(clave),
    CONSTRAINT chk_cantidad_unidades CHECK (cantidad_unidades > 0);--creo que no podia llegar a 0 jamas
);

CREATE TABLE detalle_compra (
    clave SERIAL,
    fk_almacen INT NOT NULL,
    fk_compra INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario INT NOT NULL,
    CONSTRAINT pk_detalle_compra PRIMARY KEY (clave, fk_almacen, fk_compra),
    CONSTRAINT fk_almacen_detalle_compra FOREIGN KEY (fk_almacen) REFERENCES almacen(clave),
    CONSTRAINT fk_compra_detalle_compra FOREIGN KEY (fk_compra) REFERENCES compra(clave),
    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario CHECK (precio_unitario > 0)
);

CREATE TYPE tipo_moneda AS ENUM (
    'USD',
    'EUR',
    'VES'
);

CREATE TYPE tipo_metodo_pago AS ENUM (
    'Efectivo',
    'Cheque',
    'Tarjeta de credito',
    'Tarjeta de debito',
    'Puntos'
);

CREATE TABLE metodo_de_pago (
    clave SERIAL,
    moneda tipo_moneda NOT NULL,
    metodo_preferido BOOLEAN NOT NULL DEFAULT FALSE,
    fk_usuario INT,
    valor INT,
    numero_cheque INT,
    fecha_vencimiento DATE,
    banco VARCHAR(50),
    tipo tipo_metodo_pago NOT NULL,
    CONSTRAINT pk_metodo_de_pago PRIMARY KEY (clave),
    CONSTRAINT fk_usuario_metodo_de_pago FOREIGN KEY (fk_usuario) REFERENCES usuario(clave),
    CONSTRAINT chk_metodo_preferido CHECK ((metodo_preferido = FALSE AND fk_usuario IS NULL) OR (metodo_preferido = TRUE AND fk_usuario IS NOT NULL AND tipo = 'Tarjeta de credito')),
    
    CONSTRAINT chk_tipo_metodo_de_pago CHECK (
        (tipo = 'Efectivo' AND
         valor IS NOT NULL AND
         valor > 0 AND
         numero_cheque IS NULL AND
         numero_tarjeta IS NULL AND
         fecha_vencimiento IS NULL AND
         banco IS NULL)
        OR
        (tipo = 'Cheque' AND
         numero_cheque IS NOT NULL AND
         banco IS NOT NULL AND
         valor IS NULL AND
         numero_tarjeta IS NULL AND
         fecha_vencimiento IS NULL)
        OR
        (tipo IN ('Tarjeta de credito', 'Tarjeta de debito') AND
         numero_tarjeta IS NOT NULL AND
         fecha_vencimiento IS NOT NULL AND
         banco IS NOT NULL AND
         valor IS NULL AND
         numero_cheque IS NULL)
        OR
        (tipo = 'Puntos' AND
         valor IS NULL AND
         numero_cheque IS NULL AND
         numero_tarjeta IS NULL AND
         fecha_vencimiento IS NULL AND
         banco IS NULL)
    )
);
 ---faltan checks













--FALTA POR CREAR ARRIBA CLIENTE OJO
CREATE TABLE usuario (
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
    CONSTRAINT fk_miembro_usuario FOREIGN KEY (fk_miembro) REFERENCES miembro(rif)
    -- Restricción de Arco (Exclusión Mutua)
    CONSTRAINT arco_usuario CHECK (
        (CASE WHEN fk_empleado IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_miembro IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fk_cliente IS NOT NULL THEN 1 ELSE 0 END)
        = 1
    )
);





