const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/crear', verificarToken, cartController.agregar);
router.get('/', verificarToken, cartController.listar);
router.delete('/:producto_id', verificarToken, cartController.eliminar);
router.post('/confirmar', verificarToken, cartController.confirmarPedido);

module.exports = router;
