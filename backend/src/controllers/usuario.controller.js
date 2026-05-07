const Usuario = require('../models/Usuario');

class UsuarioController {

    static async registrar(req, res) {
        try {
            const { nombre, email, password, dni, telefono } = req.body;

            const existe = await Usuario.findByEmail(email);
            if (existe) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }

            const usuario = new Usuario(nombre, email, password, dni, telefono);
            const id = await usuario.save();

            res.status(201).json({ mensaje: 'Paciente registrado exitosamente', id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al registrar paciente' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const usuario = await Usuario.findByEmail(email);
            if (!usuario) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            const passwordValida = await Usuario.verificarPassword(password, usuario.password);
            if (!passwordValida) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            res.json({
                mensaje: 'Login exitoso',
                usuario: {
                    id:       usuario.id,
                    nombre:   usuario.nombre,
                    email:    usuario.email,
                    dni:      usuario.dni,
                    telefono: usuario.telefono,
                    rol:      usuario.rol
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }

    static async getPerfil(req, res) {
        try {
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener perfil' });
        }
    }
}

module.exports = UsuarioController;