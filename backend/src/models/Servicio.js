const db = require('../config/database');

class Servicio {
    constructor(nombre, descripcion, duracion_minutos, precio, icono) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion_minutos = duracion_minutos;
        this.precio = precio;
        this.icono = icono;
    }

    static async findAll() {
        const pool = db.getPool();
        const [rows] = await pool.execute(
            'SELECT * FROM especialidades WHERE activo = TRUE'
        );
        return rows;
    }

    static async findById(id) {
        const pool = db.getPool();
        const [rows] = await pool.execute(
            'SELECT * FROM especialidades WHERE id = ? AND activo = TRUE', [id]
        );
        return rows[0] || null;
    }
}

module.exports = Servicio;