const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/reserva.controller');
const ValidacionMiddleware = require('../middlewares/validacion.middleware');

// GET /api/reservas/servicios
router.get('/servicios', ReservaController.getServicios);

// POST /api/reservas
router.post('/', 
    ValidacionMiddleware.validarReserva(), 
    ReservaController.crear
);

// GET /api/reservas/usuario/:usuario_id
router.get('/usuario/:usuario_id', ReservaController.getMisReservas);

// GET /api/reservas/todas (admin)
router.get('/todas', ReservaController.getTodasReservas);

// PUT /api/reservas/:id/estado
router.put('/:id/estado', ReservaController.actualizarEstado);

// DELETE /api/reservas/:id
router.delete('/:id', ReservaController.eliminar);

module.exports = router;