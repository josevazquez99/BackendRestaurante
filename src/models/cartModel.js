const db = require('../config/db');

const Carrito = {
  agregarProducto: async (usuarioId, productoId, cantidad = 1) => {
    const [existente] = await db.execute(
      'SELECT * FROM Carrito WHERE usuario_id = ? AND producto_id = ?',
      [usuarioId, productoId]
    );

    if (existente.length > 0) {
      await db.execute(
        'UPDATE Carrito SET cantidad = cantidad + ? WHERE usuario_id = ? AND producto_id = ?',
        [cantidad, usuarioId, productoId]
      );
    } else {
      await db.execute(
        'INSERT INTO Carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [usuarioId, productoId, cantidad]
      );
    }
  },

  obtenerCarritoUsuario: async (usuarioId) => {
    const [rows] = await db.execute(`
      SELECT c.producto_id, p.nombre, p.precio, c.cantidad
      FROM Carrito c
      LEFT JOIN Producto p ON c.producto_id = p.id
      WHERE c.usuario_id = ?`, [usuarioId]);
    return rows;
  },

  eliminarProducto: async (usuarioId, productoId) => {
    await db.execute('DELETE FROM Carrito WHERE usuario_id = ? AND producto_id = ?', [usuarioId, productoId]);
  },

  vaciarCarrito: async (usuarioId) => {
    await db.execute('DELETE FROM Carrito WHERE usuario_id = ?', [usuarioId]);
  }
};

module.exports = Carrito;
