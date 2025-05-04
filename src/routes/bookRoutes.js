const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/bookController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/cliente/:id', verificarToken, reservaController.listarPorCliente);
router.get('/fecha', verificarToken, reservaController.listarPorFecha);
router.post('/', verificarToken, reservaController.crearReserva);
router.delete('/:id', verificarToken, reservaController.eliminarReserva);
router.put('/:id', verificarToken, reservaController.actualizarReserva);

module.exports = router;
