const db = require('../config/db');

const Pedido = {
crear: async (cliente_id, productos, mesa_id, camarero_id = null) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Elegir camarero si no se recibe camarero_id
    if (!camarero_id) {
      const [camareros] = await conn.query(
        'SELECT id FROM Camarero ORDER BY RAND() LIMIT 1'
      );

      if (camareros.length > 0) {
        camarero_id = camareros[0].id;
      } else {
        const [result] = await conn.query('INSERT INTO Camarero () VALUES ()');
        camarero_id = result.insertId;
      }
    }

    // Calcular total del pedido
    let total = 0;
    for (const { producto_id, cantidad } of productos) {
      // Obtener precio del producto
      const [rows] = await conn.query('SELECT precio FROM Producto WHERE id = ?', [producto_id]);
      if (rows.length === 0) {
        throw new Error(`Producto con id ${producto_id} no encontrado`);
      }
      const precio = rows[0].precio;
      total += precio * cantidad;
    }

    // Crear pedido con total calculado
    const [pedidoResult] = await conn.query(
      'INSERT INTO Pedido (cliente_id, mesa_id, camarero_id, total) VALUES (?, ?, ?, ?)',
      [cliente_id, mesa_id, camarero_id, total]
    );

    const pedidoId = pedidoResult.insertId;

    // Insertar productos
    for (const { producto_id, cantidad } of productos) {
      await conn.query(
        'INSERT INTO Pedido_Producto (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [pedidoId, producto_id, cantidad]
      );
    }

    // Actualizar mesa si corresponde
    if (mesa_id !== null) {
      const [updateResult] = await conn.query(
        'UPDATE Mesa SET pedido_id = ? WHERE id = ?',
        [pedidoId, mesa_id]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error(`Mesa con id ${mesa_id} no encontrada`);
      }
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
      SELECT p.id, p.cliente_id, p.fecha_hora,
             u.nombre AS nombre_usuario
      FROM Pedido p
      JOIN Usuario u ON p.cliente_id = u.id
      ORDER BY p.fecha_hora DESC
    `);
    return rows;
  },
  comprobarMesa: async (mesa_id) => {
    const [rows] = await db.query(`
      SELECT * FROM Mesa WHERE id = ?
    `, [mesa_id]);
    return rows[0];
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


};

module.exports = Pedido;
