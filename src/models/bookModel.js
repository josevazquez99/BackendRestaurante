const db = require('../config/db');

const Reserva = {
  // Crear una nueva reserva
  crearReserva: async (cliente_id, mesa_id, fecha, hora, personas, observaciones) => {
    try {
      const [result] = await db.query(
        'INSERT INTO Reserva (cliente_id, mesa_id, fecha, hora, personas, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
        [cliente_id, mesa_id, fecha, hora, personas, observaciones]
      );
      return result;
    } catch (err) {
      console.error('Error al crear la reserva:', err);
      throw new Error('Error al crear la reserva');
    }
  },

  // Verificar si una mesa está ocupada en una fecha y hora determinadas
  verificarMesaOcupada: async (mesa_id, fecha, hora) => {
    try {
      const [result] = await db.query(
        'SELECT * FROM Reserva WHERE mesa_id = ? AND fecha = ? AND hora = ?',
        [mesa_id, fecha, hora]
      );
      return result.length > 0;
    } catch (err) {
      console.error('Error al verificar la mesa:', err);
      throw new Error('Error al verificar la mesa');
    }
  },

  // Listar todas las reservas de una fecha
  listarReservasPorFecha: async (fecha) => {
    try {
      const [result] = await db.query(
        'SELECT * FROM Reserva WHERE fecha = ? ORDER BY hora',
        [fecha]
      );
      return result;
    } catch (err) {
      throw new Error('Error al obtener las reservas');
    }
  },

  // Listar todas las reservas de un cliente
  listarReservasPorCliente: async (cliente_id) => {
    try {
      const [result] = await db.query(
        'SELECT * FROM Reserva WHERE cliente_id = ? ORDER BY fecha, hora',
        [cliente_id]
      );
      return result;
    } catch (err) {
      throw new Error('Error al obtener las reservas del cliente');
    }
  }
};

module.exports = Reserva;
