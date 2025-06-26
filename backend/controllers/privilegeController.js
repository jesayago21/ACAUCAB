const db = require('../config/db');

/**
 * Obtener todos los privilegios
 */
exports.getAllPrivileges = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_todos_los_privilegios()');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener privilegios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener privilegio por ID
 */
exports.getPrivilegeById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query('SELECT * FROM obtener_privilegio_por_id($1)', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Privilegio no encontrado' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener privilegio:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Crear nuevo privilegio
 */
exports.createPrivilege = async (req, res) => {
    const { nombre, descripcion } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del privilegio es requerido' });
    }
    
    try {
        const result = await db.query('SELECT * FROM crear_privilegio($1, $2)', [nombre, descripcion || null]);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear privilegio:', error);
        if (error.code === '23505') { // unique_violation
            return res.status(409).json({ message: 'Ya existe un privilegio con este nombre' });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Actualizar privilegio
 */
exports.updatePrivilege = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del privilegio es requerido' });
    }
    
    try {
        const result = await db.query('SELECT * FROM actualizar_privilegio($1, $2, $3)', [id, nombre, descripcion || null]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Privilegio no encontrado' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar privilegio:', error);
        if (error.code === '23505') { // unique_violation
            return res.status(409).json({ message: 'Ya existe un privilegio con este nombre' });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Eliminar privilegio
 */
exports.deletePrivilege = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query('SELECT eliminar_privilegio($1) as clave', [id]);
        
        if (result.rows.length === 0 || result.rows[0].clave === null) {
            return res.status(404).json({ message: 'Privilegio no encontrado' });
        }
        
        res.status(200).json({ 
            message: 'Privilegio eliminado exitosamente', 
            id: result.rows[0].clave 
        });
    } catch (error) {
        console.error('Error al eliminar privilegio:', error);
        if (error.code === '23503') { // foreign_key_violation
            return res.status(409).json({ 
                message: 'No se puede eliminar el privilegio porque está asignado a uno o más roles' 
            });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener privilegios agrupados por tabla/módulo
 */
exports.getPrivilegesByModule = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_todos_los_privilegios()');
        
        // Agrupar privilegios por módulo/tabla
        const modules = {};
        
        result.rows.forEach(privilege => {
            // Extraer el módulo del nombre del privilegio
            const parts = privilege.nombre.split('_');
            const action = parts[0]; // crear, consultar, modificar, eliminar
            const module = parts.slice(1).join('_'); // nombre de la tabla/módulo
            
            if (!modules[module]) {
                modules[module] = {
                    module: module,
                    displayName: module.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    privileges: []
                };
            }
            
            modules[module].privileges.push({
                clave: privilege.clave,
                nombre: privilege.nombre,
                descripcion: privilege.descripcion,
                action: action
            });
        });
        
        // Convertir a array y ordenar
        const moduleArray = Object.values(modules).sort((a, b) => 
            a.displayName.localeCompare(b.displayName)
        );
        
        res.status(200).json(moduleArray);
    } catch (error) {
        console.error('Error al obtener privilegios por módulo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}; 