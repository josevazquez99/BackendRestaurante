const db = require('../config/db');

const Pedido = {
  crear: async (cliente_id, productos) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Crear el pedido con estado pendiente
      const [pedidoResult] = await conn.query(
        'INSERT INTO Pedido (cliente_id, estado) VALUES (?, ?)',
        [cliente_id, 'pendiente']
      );

      const pedidoId = pedidoResult.insertId;

      // Insertar los productos del carrito en la tabla Pedido_Producto
      for (const { producto_id, cantidad } of productos) {
        await conn.query(
          'INSERT INTO Pedido_Producto (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)',
          [pedidoId, producto_id, cantidad]
        );
      }

      await conn.commit();
      return pedidoId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  obtenerTodos: async () => {
    const [rows] = await db.query(`
      SELECT p.id, p.cliente_id, p.fecha_hora, p.estado,
             u.nombre AS nombre_usuario
      FROM Pedido p
      JOIN Usuario u ON p.cliente_id = u.id
      ORDER BY p.fecha_hora DESC
    `);
    return rows;
  },

  obtenerPorId: async (id) => {
    const [pedido] = await db.query(`
      SELECT * FROM Pedido WHERE id = ?
    `, [id]);

    const [productos] = await db.query(`
      SELECT pp.producto_id, p.nombre, p.precio, pp.cantidad
      FROM Pedido_Producto pp
      JOIN Producto p ON pp.producto_id = p.id
      WHERE pp.pedido_id = ?
    `, [id]);

    return {
      ...pedido[0],
      productos
    };
  },

  actualizarEstado: async (id, estado) => {
    const [result] = await db.query(`
      UPDATE Pedido SET estado = ? WHERE id = ?
    `, [estado, id]);
    return result;
  }
};

module.exports = Pedido;
