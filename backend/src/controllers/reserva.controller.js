const Reserva = require('../models/Reserva');
const Servicio = require('../models/Servicio');

class ReservaController {

    // Obtener todos los servicios disponibles
    static async getServicios(req, res) {
        try {
            const servicios = await Servicio.findAll();
            res.json(servicios);
        } catch (error) {
            console.error('❌ Error getServicios:', error);
            res.status(500).json({ error: 'Error al obtener servicios' });
        }
    }

    // Crear nueva reserva
    static async crear(req, res) {
        try {
            const { usuario_id, servicio_id, fecha, hora, notas } = req.body;

            console.log('📥 Datos recibidos:', req.body);

            // Verificar que el servicio existe
            const servicio = await Servicio.findById(servicio_id);
            if (!servicio) {
                return res.status(404).json({ error: 'Servicio no encontrado' });
            }

            console.log('✅ Servicio encontrado:', servicio.nombre);

            const reserva = new Reserva(usuario_id, servicio_id, fecha, hora, notas);
            const id = await reserva.save();

            console.log('✅ Reserva guardada con ID:', id);

            res.status(201).json({ 
                mensaje: 'Reserva creada exitosamente', 
                id 
            });
        } catch (error) {
            console.error('❌ Error completo al crear reserva:', error);
            res.status(500).json({ error: 'Error al crear reserva' });
        }
    }

    // Obtener reservas de un usuario
    static async getMisReservas(req, res) {
        try {
            const reservas = await Reserva.findByUsuario(req.params.usuario_id);
            res.json(reservas);
        } catch (error) {
            console.error('❌ Error getMisReservas:', error);
            res.status(500).json({ error: 'Error al obtener reservas' });
        }
    }

    // Obtener todas las reservas (admin)
    static async getTodasReservas(req, res) {
        try {
            const reservas = await Reserva.findAll();
            res.json(reservas);
        } catch (error) {
            console.error('❌ Error getTodasReservas:', error);
            res.status(500).json({ error: 'Error al obtener reservas' });
        }
    }

    // Actualizar estado de reserva
    static async actualizarEstado(req, res) {
        try {
            const { estado } = req.body;
            const estadosValidos = ['pendiente', 'confirmada', 'cancelada'];

            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ error: 'Estado no válido' });
            }

            await Reserva.updateEstado(req.params.id, estado);
            res.json({ mensaje: 'Estado actualizado correctamente' });
        } catch (error) {
            console.error('❌ Error actualizarEstado:', error);
            res.status(500).json({ error: 'Error al actualizar estado' });
        }
    }

    // Eliminar reserva
    static async eliminar(req, res) {
        try {
            await Reserva.delete(req.params.id);
            res.json({ mensaje: 'Reserva eliminada correctamente' });
        } catch (error) {
            console.error('❌ Error eliminar:', error);
            res.status(500).json({ error: 'Error al eliminar reserva' });
        }
    }
}

module.exports = ReservaController;