/** Controlador de autenticación y autorización */
const db = require('../config/db');

/** Autenticar usuario y obtener información completa */
const login = async (req, res) => {
  const { username, password } = req.body;

  // Validación básica
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Usuario y contraseña son requeridos'
    });
  }

  try {
    // Consulta completa para obtener usuario, rol, permisos y entidad asociada
    const userQuery = `
      SELECT 
        u.clave as usuario_id,
        u.username,
        u.contrasena,
        u.fk_rol,
        u.fk_empleado,
        u.fk_miembro,
        u.fk_cliente,
        
        -- Información del rol
        r.nombre as rol_nombre,
        
        -- Información de empleado (si aplica)
        e.ci as empleado_ci,
        e.primer_nombre as empleado_nombre,
        e.primer_apellido as empleado_apellido,
        c.nombre as cargo_nombre,
        d.nombre as departamento_nombre,
        tf.nombre as tienda_nombre,
        
        -- Información de miembro (si aplica)
        m.rif as miembro_rif,
        m.razon_social as miembro_razon_social,
        m.denominacion_comercial as miembro_denominacion,
        
        -- Información de cliente (si aplica)
        cl.rif as cliente_rif,
        cl.tipo as cliente_tipo,
        cl.primer_nombre as cliente_nombre,
        cl.primer_apellido as cliente_apellido,
        cl.razon_social as cliente_razon_social,
        cl.puntos_acumulados as cliente_puntos
        
      FROM usuario u
      INNER JOIN rol r ON u.fk_rol = r.clave
      LEFT JOIN empleado e ON u.fk_empleado = e.ci
      LEFT JOIN contrato ct ON e.ci = ct.fk_empleado AND ct.fecha_fin IS NULL
      LEFT JOIN cargo c ON ct.fk_cargo = c.clave
      LEFT JOIN departamento d ON ct.fk_departamento = d.clave
      LEFT JOIN tienda_fisica tf ON d.fk_tienda_fisica = tf.clave
      LEFT JOIN miembro m ON u.fk_miembro = m.rif
      LEFT JOIN cliente cl ON u.fk_cliente = cl.clave
      WHERE u.username = $1 AND u.contrasena = $2;
    `;

    const userResult = await db.query(userQuery, [username, password]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const userData = userResult.rows[0];

    // Obtener permisos del rol
    const permisosQuery = `
      SELECT 
        p.clave as permiso_id,
        p.nombre as permiso_nombre,
        p.descripcion as permiso_descripcion,
        rp.fecha as fecha_asignacion
      FROM rol_pri rp
      INNER JOIN privilegio p ON rp.fk_privilegio = p.clave
      WHERE rp.fk_rol = $1
      ORDER BY p.nombre;
    `;

    const permisosResult = await db.query(permisosQuery, [userData.fk_rol]);

    // Determinar entidad principal y construir perfil
    let entidadPrincipal = null;
    let tipoEntidad = null;

    if (userData.fk_empleado) {
      tipoEntidad = 'empleado';
      entidadPrincipal = {
        tipo: 'empleado',
        id: userData.empleado_ci,
        nombre: `${userData.empleado_nombre} ${userData.empleado_apellido}`,
        cargo: userData.cargo_nombre,
        departamento: userData.departamento_nombre,
        tienda: userData.tienda_nombre
      };
    } else if (userData.fk_miembro) {
      tipoEntidad = 'miembro';
      entidadPrincipal = {
        tipo: 'miembro',
        id: userData.miembro_rif,
        razon_social: userData.miembro_razon_social,
        denominacion_comercial: userData.miembro_denominacion
      };
    } else if (userData.fk_cliente) {
      tipoEntidad = 'cliente';
      entidadPrincipal = {
        tipo: 'cliente',
        id: userData.cliente_rif,
        tipo_cliente: userData.cliente_tipo,
        nombre: userData.cliente_tipo === 'natural' 
          ? `${userData.cliente_nombre} ${userData.cliente_apellido}`
          : userData.cliente_razon_social,
        puntos_acumulados: userData.cliente_puntos || 0
      };
    }

    // Respuesta completa
    const loginResponse = {
      success: true,
      message: 'Login exitoso',
      user: {
        id: userData.usuario_id,
        username: userData.username,
        rol: {
          id: userData.fk_rol,
          nombre: userData.rol_nombre
        },
        entidad: entidadPrincipal,
        tipo_entidad: tipoEntidad,
        permisos: permisosResult.rows.map(p => ({
          id: p.permiso_id,
          nombre: p.permiso_nombre,
          descripcion: p.permiso_descripcion
        }))
      }
    };

    res.status(200).json(loginResponse);

  } catch (error) {
    console.error('Error durante el login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/** Verificar permisos específicos */
const verificarPermiso = async (req, res) => {
  const { usuario_id, permiso_nombre } = req.body;

  if (!usuario_id || !permiso_nombre) {
    return res.status(400).json({
      success: false,
      message: 'Usuario ID y nombre de permiso son requeridos'
    });
  }

  try {
    const permisoQuery = `
      SELECT COUNT(*) as tiene_permiso
      FROM usuario u
      INNER JOIN rol_pri rp ON u.fk_rol = rp.fk_rol
      INNER JOIN privilegio p ON rp.fk_privilegio = p.clave
      WHERE u.clave = $1 AND p.nombre = $2;
    `;

    const result = await db.query(permisoQuery, [usuario_id, permiso_nombre]);
    const tienePermiso = parseInt(result.rows[0].tiene_permiso) > 0;

    res.status(200).json({
      success: true,
      tiene_permiso: tienePermiso,
      message: tienePermiso ? 'Permiso concedido' : 'Permiso denegado'
    });

  } catch (error) {
    console.error('Error verificando permiso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/** Obtener información completa del usuario logueado */
const getPerfilUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    // Reutilizar la misma query del login pero filtrar por ID
    const userQuery = `
      SELECT 
        u.clave as usuario_id,
        u.username,
        u.fk_rol,
        u.fk_empleado,
        u.fk_miembro,
        u.fk_cliente,
        
        -- Información del rol
        r.nombre as rol_nombre,
        
        -- Información de empleado (si aplica)
        e.ci as empleado_ci,
        e.primer_nombre as empleado_nombre,
        e.primer_apellido as empleado_apellido,
        c.nombre as cargo_nombre,
        d.nombre as departamento_nombre,
        tf.nombre as tienda_nombre,
        
        -- Información de miembro (si aplica)
        m.rif as miembro_rif,
        m.razon_social as miembro_razon_social,
        m.denominacion_comercial as miembro_denominacion,
        
        -- Información de cliente (si aplica)
        cl.rif as cliente_rif,
        cl.tipo as cliente_tipo,
        cl.primer_nombre as cliente_nombre,
        cl.primer_apellido as cliente_apellido,
        cl.razon_social as cliente_razon_social,
        cl.puntos_acumulados as cliente_puntos
        
      FROM usuario u
      INNER JOIN rol r ON u.fk_rol = r.clave
      LEFT JOIN empleado e ON u.fk_empleado = e.ci
      LEFT JOIN contrato ct ON e.ci = ct.fk_empleado AND ct.fecha_fin IS NULL
      LEFT JOIN cargo c ON ct.fk_cargo = c.clave
      LEFT JOIN departamento d ON ct.fk_departamento = d.clave
      LEFT JOIN tienda_fisica tf ON d.fk_tienda_fisica = tf.clave
      LEFT JOIN miembro m ON u.fk_miembro = m.rif
      LEFT JOIN cliente cl ON u.fk_cliente = cl.clave
      WHERE u.clave = $1;
    `;

    const userResult = await db.query(userQuery, [usuario_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const userData = userResult.rows[0];

    // Obtener permisos
    const permisosQuery = `
      SELECT 
        p.clave as permiso_id,
        p.nombre as permiso_nombre,
        p.descripcion as permiso_descripcion
      FROM rol_pri rp
      INNER JOIN privilegio p ON rp.fk_privilegio = p.clave
      WHERE rp.fk_rol = $1
      ORDER BY p.nombre;
    `;

    const permisosResult = await db.query(permisosQuery, [userData.fk_rol]);

    res.status(200).json({
      success: true,
      user: userData,
      permisos: permisosResult.rows
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login,
  verificarPermiso,
  getPerfilUsuario
}; 