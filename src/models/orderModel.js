const db = require('../config/db');

const Pedido = {
/**
 * Creates a new order in the system.
 *
 * This function handles the creation of an order for a given client, including
 * selecting or assigning a waiter, calculating the total cost based on the
 * provided products and their quantities, and updating the corresponding table
 * if necessary. It also inserts the order and its associated products into
 * the database.
 *
 * @param {number} cliente_id - The ID of the client placing the order.
 * @param {Array<{producto_id: number, cantidad: number}>} productos - A list of products with their respective quantities.
 * @param {number|null} mesa_id - The ID of the table for the order, if applicable.
 * @param {number|null} [camarero_id=null] - The ID of the waiter assigned to the order. If not provided, one will be assigned randomly.
 * @returns {Promise<number>} The ID of the newly created order.
 * @throws {Error} If any database operation fails or if a product or table is not found.
 */

crear: async (cliente_id, productos, mesa_id, camarero_id = null) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Elegir camarero si no se recibe camarero_id
    if (!camarero_id) {
      const [camareros] = await conn.execute(
        'SELECT id FROM Camarero ORDER BY RAND() LIMIT 1'
      );

      if (camareros.length > 0) {
        camarero_id = camareros[0].id;
      } else {
        const [result] = await conn.execute('INSERT INTO Camarero () VALUES ()');
        camarero_id = result.insertId;
      }
    }

    // Calcular total del pedido
    let total = 0;
    for (const { producto_id, cantidad } of productos) {
      // Obtener precio del producto
      const [rows] = await conn.execute('SELECT precio FROM Producto WHERE id = ?', [producto_id]);
      if (rows.length === 0) {
        throw new Error(`Producto con id ${producto_id} no encontrado`);
      }
      const precio = rows[0].precio;
      total += precio * cantidad;
    }

    // Crear pedido con total calculado
    const [pedidoResult] = await conn.execute(
      'INSERT INTO Pedido (cliente_id, mesa_id, camarero_id, total) VALUES (?, ?, ?, ?)',
      [cliente_id, mesa_id, camarero_id, total]
    );

    const pedidoId = pedidoResult.insertId;

    // Insertar productos
    for (const { producto_id, cantidad } of productos) {
      await conn.execute(
        'INSERT INTO Pedido_Producto (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [pedidoId, producto_id, cantidad]
      );
    }

    // Actualizar mesa si corresponde
    if (mesa_id !== null) {
      const [updateResult] = await conn.execute(
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




  /**
   * Retrieves all orders from the database, sorted by date in descending order (newest first).
   *
   * @returns {Promise<Array<{id: number, cliente_id: number, fecha_hora: string, nombre_usuario: string}>>}
   *          A list of orders with their respective IDs, client IDs, timestamps, and client names.
   */
  obtenerTodos: async () => {
    const [rows] = await db.execute(`
      SELECT p.id, p.cliente_id, p.fecha_hora,
             u.nombre AS nombre_usuario
      FROM Pedido p
      JOIN Usuario u ON p.cliente_id = u.id
      ORDER BY p.fecha_hora DESC
    `);
    return rows;
  },
  /**
   * Checks the existence of a table in the database by its ID.
   *
   * @param {number} mesa_id - The ID of the table to be checked.
   * @returns {Promise<Object|null>} The table object if found, otherwise null.
   * @throws {Error} If any database operation fails.
   */

  comprobarMesa: async (mesa_id) => {
    const [rows] = await db.execute(`
      SELECT * FROM Mesa WHERE id = ?
    `, [mesa_id]);
    return rows[0];
  },


  /**
   * Retrieves a single order with its associated products from the database by its ID.
   *
   * @param {number} id - The ID of the order to retrieve.
   * @returns {Promise<Object>} An object containing the order's details, including its products.
   * @throws {Error} If the order is not found or any database operation fails.
   */
  obtenerPorId: async (id) => {
    const [pedido] = await db.execute(`
      SELECT * FROM Pedido WHERE id = ?
    `, [id]);

    const [productos] = await db.execute(`
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
