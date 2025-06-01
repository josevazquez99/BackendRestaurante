const db = require('../config/db');

const Carrito = {


  /**
   * Agrega un producto al carrito de un usuario
   *
   * Si el producto ya existe en el carrito, se suma la cantidad
   * especificada a la cantidad existente. Si no existe, se crea
   * un nuevo registro en la tabla Carrito con la cantidad
   * especificada.
   *
   * @param {number} usuarioId ID del usuario que realiza la acci n
   * @param {number} productoId ID del producto a agregar
   * @param {number} [cantidad=1] Cantidad del producto a agregar
   * @returns {Promise<void>}
   */
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

  /**
   * Obtiene el carrito de un usuario
   *
   * @param {number} usuarioId ID del usuario
   * @returns {Promise<Array<Object>>} Un arreglo de objetos con informaci n del carrito.
   *                                    Cada objeto contiene las propiedades
   *                                    `productoId`, `nombre`, `precio` y `cantidad`.
   */
  obtenerCarritoUsuario: async (usuarioId) => {
    const [rows] = await db.execute(`
      SELECT c.producto_id, p.nombre, p.precio, c.cantidad
      FROM Carrito c
      LEFT JOIN Producto p ON c.producto_id = p.id
      WHERE c.usuario_id = ?`, [usuarioId]);
    return rows;
  },

  /**
   * Elimina un producto específico del carrito de un usuario.
   *
   * @param {number} usuarioId - ID del usuario.
   * @param {number} productoId - ID del producto a eliminar.
   * @returns {Promise<void>}
   */

  eliminarProducto: async (usuarioId, productoId) => {
    await db.execute('DELETE FROM Carrito WHERE usuario_id = ? AND producto_id = ?', [usuarioId, productoId]);
  },


  /**
   * Elimina todos los productos del carrito de un usuario.
   *
   * @param {number} usuarioId - ID del usuario.
   * @returns {Promise<void>}
   */
  vaciarCarrito: async (usuarioId) => {
    await db.execute('DELETE FROM Carrito WHERE usuario_id = ?', [usuarioId]);
  }
};

module.exports = Carrito;
