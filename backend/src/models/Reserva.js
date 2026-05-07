const db = require('../config/database');

class Reserva {
    constructor(usuario_id, servicio_id, fecha, hora, notas = '') {
        this.usuario_id = usuario_id;
        this.servicio_id = servicio_id;
        this.fecha = fecha;
        this.hora = hora;
        this.notas = notas;
    }

    async save() {
        const pool = db.getPool();
        const [result] = await pool.execute(
            'INSERT INTO reservas (usuario_id, especialidad_id, fecha, hora, motivo) VALUES (?, ?, ?, ?, ?)',
            [this.usuario_id, this.servicio_id, this.fecha, this.hora, this.notas]
        );
        return result.insertId;
    }

    static async findByUsuario(usuario_id) {
        const pool = db.getPool();
        const [rows] = await pool.execute(
            `SELECT r.*, e.nombre as servicio, e.precio 
             FROM reservas r 
             JOIN especialidades e ON r.especialidad_id = e.id 
             WHERE r.usuario_id = ? 
             ORDER BY r.fecha DESC, r.hora DESC`,
            [usuario_id]
        );
        return rows;
    }

    static async findAll() {
        const pool = db.getPool();
        const [rows] = await pool.execute(
            `SELECT r.*, e.nombre as servicio, u.nombre as cliente
             FROM reservas r
             JOIN especialidades e ON r.especialidad_id = e.id
             JOIN usuarios u ON r.usuario_id = u.id
             ORDER BY r.fecha DESC, r.hora DESC`
        );
        return rows;
    }

    static async updateEstado(id, estado) {
        const pool = db.getPool();
        await pool.execute(
            'UPDATE reservas SET estado = ? WHERE id = ?', [estado, id]
        );
    }

    static async delete(id) {
        const pool = db.getPool();
        await pool.execute('DELETE FROM reservas WHERE id = ?', [id]);
    }
}

module.exports = Reserva;