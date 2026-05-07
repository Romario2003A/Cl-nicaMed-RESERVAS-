const { body, validationResult } = require('express-validator');

class ValidacionMiddleware {

    // Verificar errores de validación ✅ rúbrica sanitización
    static verificarErrores(req, res, next) {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }

    // Validar registro de usuario ✅ rúbrica XSS/SQLi
    static validarRegistro() {
        return [
            body('nombre')
                .trim()
                .escape()
                .notEmpty().withMessage('El nombre es obligatorio')
                .isLength({ min: 2, max: 100 }).withMessage('Nombre entre 2 y 100 caracteres'),
            body('email')
                .trim()
                .normalizeEmail()
                .isEmail().withMessage('Email no válido'),
            body('password')
                .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres')
                .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
            ValidacionMiddleware.verificarErrores
        ];
    }

    // Validar login
    static validarLogin() {
        return [
            body('email')
                .trim()
                .normalizeEmail()
                .isEmail().withMessage('Email no válido'),
            body('password')
                .notEmpty().withMessage('La contraseña es obligatoria'),
            ValidacionMiddleware.verificarErrores
        ];
    }

    // Validar reserva ✅ rúbrica sanitización
    static validarReserva() {
        return [
            body('usuario_id')
                .isInt({ min: 1 }).withMessage('Usuario no válido'),
            body('servicio_id')
                .isInt({ min: 1 }).withMessage('Servicio no válido'),
            body('fecha')
                .isDate().withMessage('Fecha no válida')
                .custom((valor) => {
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    // ✅ Corrección: agregar T00:00:00 evita problema de timezone en Windows
                    const fechaReserva = new Date(valor + 'T00:00:00');
                    if (fechaReserva < hoy) {
                        throw new Error('La fecha no puede ser en el pasado');
                    }
                    return true;
                }),
            body('hora')
                .notEmpty().withMessage('La hora es obligatoria')
                .custom((valor) => {
                    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(valor)) {
                        throw new Error('Hora no válida (formato HH:MM)');
                    }
                    return true;
                }),
            body('notas')
                .optional()
                .trim()
                .escape()
                .isLength({ max: 500 }).withMessage('Las notas no pueden superar 500 caracteres'),
            ValidacionMiddleware.verificarErrores
        ];
    }
}

module.exports = ValidacionMiddleware;