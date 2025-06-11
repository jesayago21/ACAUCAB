CREATE TABLE lugar (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    fk_lugar INT,
    CONSTRAINT pk_lugar PRIMARY KEY (clave),
    CONSTRAINT fk_tipo_lugar FOREIGN KEY (fk_lugar) REFERENCES lugar(clave),
    CONSTRAINT chk_tipo_lugar CHECK (tipo IN ('estado', 'municipio', 'parroquia'))
);


CREATE TABLE tipo_cerveza (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion VARCHAR (255),
    historia VARCHAR (255),
    fk_tipo_cerveza INT NOT NULL,
    fk_receta INT NOT NULL,
    CONSTRAINT pk_tipo_cerveza PRIMARY KEY (clave),
    CONSTRAINT fk_tipo_cerveza FOREIGN KEY (fk_tipo_cerveza) REFERENCES tipo_cerveza(clave),
    CONSTRAINT fk_receta_tipo_cerveza FOREIGN KEY (fk_receta) REFERENCES receta(clave)
);

CREATE TABLE cerveza (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    grado_alcohol INT NOT NULL,
    fk_receta INT NOT NULL,
    fk_miembro INT NOT NULL,
    CONSTRAINT pk_cerveza PRIMARY KEY (clave),
    CONSTRAINT fk_tipo_cerveza FOREIGN KEY (clave) REFERENCES tipo_cerveza(clave),
    CONSTRAINT fk_receta_cerveza FOREIGN KEY (fk_receta) REFERENCES receta(clave),
    CONSTRAINT fk_miembro_cerveza FOREIGN KEY (fk_miembro) REFERENCES miembro(rif)
);

CREATE TABLE ingrediente (
        clave SERIAL,
        nombre VARCHAR (50) NOT NULL,
        descripcion VARCHAR (255) NOT NULL,
        CONSTRAINT pk_ingrediente PRIMARY KEY (clave)
);

CREATE TABLE receta (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion VARCHAR (255) NOT NULL,
    CONSTRAINT pk_receta PRIMARY KEY (clave)
);

-- TABLA N:N duda?
CREATE TABLE ing_cer(
    clave SERIAL,
    cantidad INT NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    fk_receta INT NOT NULL,
    fk_ingrediente INT NOT NULL,
    CONSTRAINT fk_receta_ing_cer FOREIGN KEY (fk_receta) REFERENCES receta(clave),
    CONSTRAINT fk_ingrediente_ing_cer FOREIGN KEY (fk_ingrediente) REFERENCES ingrediente(clave),
    CONSTRAINT pk_ing_cer PRIMARY KEY (clave)
);
-----------------------------

CREATE TABLE instruccion (
    clave SERIAL,
    numero_paso VARCHAR(50) NOT NULL,
    descripcion VARCHAR (255) NOT NULL,
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
    descripcion VARCHAR (255),
    valor INT,
    fk_caracteristica INT NOT NULL,
    fk_cerveza INT NOT NULL,
    CONSTRAINT pk_car_cer PRIMARY KEY (clave),
    CONSTRAINT fk_caracteristica_car_cer FOREIGN KEY (fk_caracteristica) REFERENCES caracteristica(clave),
    CONSTRAINT fk_cerveza_car_cer FOREIGN KEY (fk_cerveza) REFERENCES cerveza(clave),
    CONSTRAINT uq_car_cer UNIQUE (fk_caracteristica, fk_cerveza)
);

CREATE TABLE car_tip (
    clave SERIAL,
    descripcion VARCHAR (255),
    valor INT,
    rango_menor INT,
    rango_mayor INT,
    fk_caracteristica INT NOT NULL,
    fk_tipo_cerveza INT NOT NULL,
    CONSTRAINT pk_car_tip PRIMARY KEY (clave),
    CONSTRAINT fk_caracteristica_car_tip FOREIGN KEY (fk_caracteristica) REFERENCES caracteristica(clave),
    CONSTRAINT fk_tipo_cerveza_car_tip FOREIGN KEY (fk_tipo_cerveza) REFERENCES tipo_cerveza(clave),
    CONSTRAINT uq_car_tip UNIQUE (fk_caracteristica, fk_tipo_cerveza)
);

-- EVENTOS

CREATE TABLE tipo_evento (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    descripcion VARCHAR (255) NOT NULL,
    CONSTRAINT pk_tipo_evento PRIMARY KEY (clave)
);

CREATE TABLE tipo_invitado (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
);

CREATE TABLE invitado (
    ci SERIAL,
    rif INT NOT NULL,
    primer_nombre VARCHAR (50) NOT NULL,
    primer_apellido VARCHAR (50),
    fk_tipo_invitado INT NOT NULL,
    CONSTRAINT pk_invitado PRIMARY KEY (ci),
    CONSTRAINT fk_tipo_invitado FOREIGN KEY (fk_tipo_invitado) REFERENCES tipo_invitado(clave)
);

CREATE TABLE evento (
    clave SERIAL,
    nombre VARCHAR (50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    direccion VARCHAR (255) NOT NULL,
    precio_entrada INT,
    fk_evento INT NOT NULL,
    fk_lugar INT NOT NULL,
    fk_tipo_evento INT NOT NULL,
    CONSTRAINT pk_evento PRIMARY KEY (clave),
    CONSTRAINT fk_evento FOREIGN KEY (fk_evento) REFERENCES evento(clave),
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