const Carrito = require('../models/cartModel');
const Pedido = require('../models/orderModel');

const cartController = {
  agregar: async (req, res) => {
    const usuarioId = req.usuario.id;
    const { producto_id, cantidad } = req.body;

    try {
      await Carrito.agregarProducto(usuarioId, producto_id, cantidad);
      res.json({ mensaje: 'Producto agregado al carrito' });
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al agregar al carrito', error: err.message });
    }
  },

  listar: async (req, res) => {
    const usuarioId = req.usuario.id;
    try {
      const productos = await Carrito.obtenerCarritoUsuario(usuarioId);
      res.json(productos);
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al obtener carrito', error: err.message });
    }
  },

  eliminar: async (req, res) => {
    const usuarioId = req.usuario.id;
    const { producto_id } = req.params;
    try {
      await Carrito.eliminarProducto(usuarioId, producto_id);
      res.json({ mensaje: 'Producto eliminado del carrito' });
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al eliminar producto', error: err.message });
    }
  },

  confirmarPedido: async (req, res) => {
    const usuarioId = req.usuario.id;
    try {
      const productos = await Carrito.obtenerCarritoUsuario(usuarioId);

      if (productos.length === 0) {
        return res.status(400).json({ mensaje: 'El carrito está vacío' });
      }

      const productosFormateados = productos.map(p => ({
        producto_id: p.producto_id,
        cantidad: p.cantidad
      }));

      const pedidoId = await Pedido.crear(usuarioId, productosFormateados);
      await Carrito.vaciarCarrito(usuarioId);

      res.status(201).json({ mensaje: 'Pedido creado a partir del carrito', pedidoId });
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al crear pedido', error: err.message });
    }
  }
};

module.exports = cartController;
