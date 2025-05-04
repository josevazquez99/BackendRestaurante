const db = require('../config/db');
const Reserva = require('../models/bookModel'); 

const reservaController = {
  // Listar todas las reservas para una fecha
  listarPorFecha: async (req, res) => {
    const { fecha } = req.query;

    try {
      if (!fecha) {
        return res.status(400).json({ mensaje: 'La fecha es obligatoria' });
      }

      const reservas = await Reserva.listarReservasPorFecha(fecha);
      return res.json(reservas);
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al obtener reservas', error: err.message });
    }
  },

  // Listar todas las reservas de un cliente
  listarPorCliente: async (req, res) => {
    const { id } = req.params;

    try {
      const reservas = await Reserva.listarReservasPorCliente(id);

      if (reservas.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron reservas para este cliente' });
      }

      return res.json(reservas);
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al obtener las reservas del cliente', error: err.message });
    }
  },

  // Crear una nueva reserva
  crearReserva: async (req, res) => {
    const { cliente_id, mesa_id, fecha, hora, personas, observaciones } = req.body;

    if (!cliente_id || !mesa_id || !fecha || !hora || !personas) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    try {
      // Validar si el cliente existe
      const [cliente] = await db.query('SELECT id FROM Cliente WHERE id = ?', [cliente_id]);
      if (cliente.length === 0) {
        return res.status(404).json({ mensaje: 'El cliente no existe' });
      }

      // Validar si la mesa existe
      const [mesa] = await db.query('SELECT id FROM Mesa WHERE id = ?', [mesa_id]);
      if (mesa.length === 0) {
        return res.status(404).json({ mensaje: 'La mesa no existe' });
      }

      // Verificar si la mesa está ocupada en esa fecha y hora
      const mesaOcupada = await Reserva.verificarMesaOcupada(mesa_id, fecha, hora);

      if (mesaOcupada) {
        return res.status(409).json({ mensaje: 'La mesa ya está ocupada en esa fecha y hora' });
      }

      // Crear la reserva
      await Reserva.crearReserva(cliente_id, mesa_id, fecha, hora, personas, observaciones);
      return res.status(201).json({ mensaje: 'Reserva creada correctamente' });
    } catch (err) {
      console.error('Error al crear la reserva:', err); 
      return res.status(500).json({ mensaje: 'Error al crear la reserva', error: err.message });
    }
  },

  // Eliminar una reserva
  eliminarReserva: async (req, res) => {
    const { id } = req.params;

    try {
      const resultado = await Reserva.eliminarReserva(id);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Reserva no encontrada' });
      }

      return res.json({ mensaje: 'Reserva eliminada correctamente' });
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al eliminar reserva', error: err.message });
    }
  },

  // Actualizar una reserva
  actualizarReserva: async (req, res) => {
    const { id } = req.params;
    const { mesa_id, fecha, hora, personas, observaciones } = req.body;

    if (!mesa_id && !fecha && !hora && !personas && !observaciones) {
      return res.status(400).json({ mensaje: 'Debes enviar al menos un campo para actualizar' });
    }

    try {
      const resultado = await Reserva.actualizarReserva(id, { mesa_id, fecha, hora, personas, observaciones });

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Reserva no encontrada' });
      }

      return res.json({ mensaje: 'Reserva actualizada correctamente' });
    } catch (err) {
      return res.status(500).json({ mensaje: 'Error al actualizar la reserva', error: err.message });
    }
  }
};

module.exports = reservaController;
