const Pedido = require('../models/orderModel');

const pedidoController = {
  crearPedido: async (req, res) => {
    const usuarioId = req.usuario.id;
    const { productos } = req.body;

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Se requiere al menos un producto' });
    }

    try {
      const pedidoId = await Pedido.crear(usuarioId, productos);
      return res.status(201).json({ mensaje: 'Pedido creado', pedidoId });
    } catch (err) {
      console.error('Error al crear pedido:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
    }
  },

  listarPedidos: async (req, res) => {
    try {
      const pedidos = await Pedido.obtenerTodos();
      return res.json(pedidos);
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al obtener pedidos', error: err.message });
    }
  },
  verDetallePedido: async (req, res) => {
    const { id } = req.params;
  
    try {
      const pedido = await Pedido.obtenerPorId(id);
      if (!pedido) {
        return res.status(404).json({ mensaje: 'Pedido no encontrado' });
      }
      res.json(pedido);
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al obtener el pedido', error: err.message });
    }
  },
  actualizarEstado: async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const rolesPermitidos = ['camarero', 'cocina', 'administrador'];
  
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para actualizar el estado del pedido' });
    }
  
    try {
      const result = await Pedido.actualizarEstado(id, estado);
      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Pedido no encontrado' });
      }
      res.json({ mensaje: 'Estado del pedido actualizado' });
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al actualizar estado', error: err.message });
    }
  }
  
  
};

module.exports = pedidoController;
