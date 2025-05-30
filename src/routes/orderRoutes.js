const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/orderController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, pedidoController.crearPedido);
router.get('/', verificarToken, pedidoController.listarPedidos);
router.get('/:id', verificarToken, pedidoController.verDetallePedido);
router.get('/:id/mesa', verificarToken, pedidoController.comprobarMesa);
module.exports = router;
