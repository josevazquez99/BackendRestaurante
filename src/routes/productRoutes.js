const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarAdministrador } = require('../middlewares/rolMiddleware');

router.get('/', productoController.listar);

router.post('/', verificarToken, verificarAdministrador, productoController.crear);

router.delete('/:id', verificarToken, verificarAdministrador, productoController.eliminar);

router.put('/:id', verificarToken, verificarAdministrador, productoController.actualizarProducto);

module.exports = router;
