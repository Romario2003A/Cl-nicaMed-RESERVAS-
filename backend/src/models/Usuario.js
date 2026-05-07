const db = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario {
    constructor(nombre, email, password, dni = '', telefono = '', rol = 'paciente') {
        this.nombre   = nombre;
        this.email    = email;
        this.password = password;
        this.dni      = dni;
        this.telefono = telefono;
        this.rol      = rol;
    }

    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async save() {
        await this.hashPassword();
        const pool = db.getPool();
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, email, password, dni, telefono, rol) VALUES (?, ?, ?, ?, ?, ?)',
            [this.nombre, this.email, this.password, this.dni, this.telefono, this.rol]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const pool = db.getPool();
        const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?', [email]
        );
        return rows[0] || null;
    }

    static async findById(id) {
        const pool = db.getPool();
        const [rows] = await pool.execute(
            'SELECT id, nombre, email, dni, telefono, rol FROM usuarios WHERE id = ?', [id]
        );
        return rows[0] || null;
    }

    static async verificarPassword(passwordPlano, passwordHash) {
        return await bcrypt.compare(passwordPlano, passwordHash);
    }
}

module.exports = Usuario;