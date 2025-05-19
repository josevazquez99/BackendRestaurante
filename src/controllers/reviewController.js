const Resena = require('../models/reviewModel');

// Obtener todas las reseñas
const obtenerResenas = async (req, res) => {
  try {
    const resenas = await Resena.obtenerTodos();
    res.status(200).json(resenas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las reseñas', error });
  }
};

// Obtener reseña por ID
const obtenerResenaPorId = async (req, res) => {
  try {
    const resena = await Resena.obtenerPorId(req.params.id);
    if (resena) {
      res.status(200).json(resena);
    } else {
      res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la reseña', error });
  }
};

// Obtener reseñas por producto
const obtenerResenasPorProducto = async (req, res) => {
  try {
    const resenas = await Resena.obtenerPorProducto(req.params.productoId);
    res.status(200).json(resenas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reseñas del producto', error });
  }
};

// Crear una nueva reseña
const crearResena = async (req, res) => {
  const { producto_id, cliente_id, calificacion, comentario, fecha } = req.body;

  if (!producto_id || !cliente_id || !calificacion) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    const nuevaResenaId = await Resena.crear(producto_id, cliente_id, calificacion, comentario, fecha);
    res.status(201).json({ id: nuevaResenaId, mensaje: 'Reseña creada con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la reseña', error });
  }
};

// Actualizar una reseña
const actualizarResena = async (req, res) => {
  const { calificacion, comentario } = req.body;

  try {
    const resultado = await Resena.actualizar(req.params.id, { calificacion, comentario });
    res.status(200).json({ mensaje: 'Reseña actualizada', resultado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la reseña', error });
  }
};

// Eliminar una reseña
const eliminarResena = async (req, res) => {
  try {
    const resultado = await Resena.eliminar(req.params.id);
    res.status(200).json({ mensaje: 'Reseña eliminada', resultado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la reseña', error });
  }
};

module.exports = {
  obtenerResenas,
  obtenerResenaPorId,
  obtenerResenasPorProducto,
  crearResena,
  actualizarResena,
  eliminarResena
};
