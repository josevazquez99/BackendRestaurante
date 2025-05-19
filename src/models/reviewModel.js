const db = require('../config/db');

const Resena = {
  obtenerTodos: async () => {
    const [filas] = await db.query('SELECT * FROM Resena');
    return filas;
  },

  obtenerPorId: async (id) => {
    const [filas] = await db.query('SELECT * FROM Resena WHERE id = ?', [id]);
    return filas[0];
  },

  obtenerPorProducto: async (productoId) => {
    const [filas] = await db.query(
      'SELECT * FROM Resena WHERE producto_id = ? ORDER BY fecha DESC',
      [productoId]
    );
    return filas;
  },

  crear: async (producto_id, cliente_id, calificacion, comentario, fecha = null) => {
    const [resultado] = await db.query(
      'INSERT INTO Resena (producto_id, cliente_id, calificacion, comentario, fecha) VALUES (?, ?, ?, ?, ?)',
      [producto_id, cliente_id, calificacion, comentario, fecha]
    );
    return resultado.insertId;
  },

  eliminar: async (id) => {
    const [resultado] = await db.query('DELETE FROM Resena WHERE id = ?', [id]);
    return resultado;
  },

  actualizar: async (id, datos) => {
    const { calificacion, comentario } = datos;
    const [resultado] = await db.query(
      'UPDATE Resena SET calificacion = ?, comentario = ? WHERE id = ?',
      [calificacion, comentario, id]
    );
    return resultado;
  }
};

module.exports = Resena;
