const Pedido = require('../models/orderModel');

const pedidoController = {

crearPedido: async (req, res) => {
  const usuarioId = req.usuario.id;
  const { productos, mesa_id, tipo_entrega } = req.body;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Se requiere al menos un producto' });
  }

  if (tipo_entrega === "mesa" && !mesa_id) {
    return res.status(400).json({ mensaje: 'Se requiere una mesa para asignar el pedido' });
  }

  if (tipo_entrega !== "mesa" && tipo_entrega !== "recoger") {
    return res.status(400).json({ mensaje: 'Tipo de entrega no válido' });
  }

  try {
    const pedidoId = await Pedido.crear(usuarioId, productos, tipo_entrega === "mesa" ? mesa_id : null);
    return res.status(201).json({ mensaje: 'Pedido creado', pedidoId });
  } catch (err) {
    console.error('Error al crear pedido:', err);
    return res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  }
},
comprobarMesa: async (req, res) => {
  const mesa_id = req.params.id;
  
  try {
      const mesa = await Pedido.comprobarMesa(mesa_id);
      if (!mesa) {
      return res.status(404).json({ mensaje: 'Mesa no encontrada' });
      }
      return res.json(mesa);
  } catch (err) {
      console.error('Error al comprobar la mesa:', err);
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
  
  
};

module.exports = pedidoController;
