const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/reviewController');

// Obtener todas las reseñas
router.get('/', resenaController.obtenerResenas);

// Obtener una reseña por ID
router.get('/:id', resenaController.obtenerResenaPorId);

// Obtener todas las reseñas de un producto
router.get('/producto/:productoId', resenaController.obtenerResenasPorProducto);

// Crear una nueva reseña
router.post('/', resenaController.crearResena);

// Actualizar una reseña existente
router.put('/:id', resenaController.actualizarResena);

// Eliminar una reseña
router.delete('/:id', resenaController.eliminarResena);

module.exports = router;
