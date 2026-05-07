const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const ValidacionMiddleware = require('../middlewares/validacion.middleware');

// POST /api/usuarios/registrar
router.post('/registrar', 
    ValidacionMiddleware.validarRegistro(), 
    UsuarioController.registrar
);

// POST /api/usuarios/login
router.post('/login', 
    ValidacionMiddleware.validarLogin(), 
    UsuarioController.login
);

// GET /api/usuarios/:id
router.get('/:id', UsuarioController.getPerfil);

module.exports = router;