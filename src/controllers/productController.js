const Producto = require('../models/productModel');

const productoController = {
  listar: async (req, res) => {
    try {
      const productos = await Producto.obtenerTodos();
      return res.json(productos);
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al obtener productos', error: err.message });
    }
  },

  agregarProductoCarrito: async (req, res) => {
    const { id } = req.params;
    try {
      const producto = await Producto.agregarProductoCarrito(id);
      return res.json(producto);
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al agregar producto al carrito', error: err.message });
    }
  },
  eliminarProductoCarrito: async (req, res) => {
    const { id } = req.params;
    try {
      const producto = await Producto.eliminarProductoCarrito(id);
      return res.json(producto);
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al eliminar producto del carrito', error: err.message });
    }
  },

  listarPorId: async (req, res) => {
    const { id } = req.params;
    try {
      const producto = await Producto.obtenerPorId(id);
      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
      return res.json(producto);
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al obtener producto', error: err.message });
    }
  },

  crear: async (req, res) => {
    const { nombre, descripcion, precio, categoria } = req.body;

    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ mensaje: 'Nombre, precio y categoría son obligatorios' });
    }

    try {
      const id = await Producto.crear(nombre, descripcion, precio, categoria);
      return res.status(201).json({ mensaje: 'Producto creado', id });
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al crear producto', error: err.message });
    }
  },

  eliminar: async (req, res) => {
    const { id } = req.params;

    try {
      const resultado = await Producto.eliminar(id);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Producto no encontrado para eliminar' });
      }

      return res.json({ mensaje: 'Producto eliminado' });
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al eliminar producto', error: err.message });
    }
  },

  actualizarProducto: async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria } = req.body;

    if (!nombre && !descripcion && !precio && !categoria) {
      return res.status(400).json({ mensaje: 'Debes enviar al menos un campo para actualizar' });
    }

    try {
      const resultado = await Producto.actualizar(id, { nombre, descripcion, precio, categoria });
      
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      return res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      return res.status(500).json({ mensaje: 'Error al actualizar producto', error: err.message });
    }
  }
};

module.exports = productoController;
