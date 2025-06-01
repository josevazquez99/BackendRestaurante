const db = require('../config/db');

const Resena = {
  /**
   * Retrieves all reviews from the database.
   *
   * @returns {Promise<Array<Object>>}
   *          A list of reviews with their respective IDs, client IDs, product IDs, ratings, comments, and timestamps.
   */
  obtenerTodos: async () => {
    const [filas] = await db.execute('SELECT * FROM Resena');
    return filas;
  },

  /**
   * Retrieves a single review from the database by its ID.
   *
   * @param {number} id - The ID of the review to retrieve.
   * @returns {Promise<Object>} The review with the specified ID, or null if it doesn't exist.
   */
  obtenerPorId: async (id) => {
    const [filas] = await db.execute('SELECT * FROM Resena WHERE id = ?', [id]);
    return filas[0];
  },

  /**
   * Retrieves all reviews for a specific product from the database, ordered by date in descending order.
   *
   * @param {number} productoId - The ID of the product for which to retrieve reviews.
   * @returns {Promise<Array<Object>>} A list of reviews for the specified product, ordered by the most recent first.
   */

  obtenerPorProducto: async (productoId) => {
    const [filas] = await db.execute(
      'SELECT * FROM Resena WHERE producto_id = ? ORDER BY fecha DESC',
      [productoId]
    );
    return filas;
  },

  /**
   * Creates a new review in the database.
   *
   * @param {number} producto_id - The ID of the product being reviewed.
   * @param {number} cliente_id - The ID of the client who is writing the review.
   * @param {number} calificacion - The rating given to the product by the client.
   * @param {string} comentario - The text of the review.
   * @param {Date} [fecha] - The timestamp of the review. Defaults to the current date and time if unspecified.
   * @returns {Promise<number>} The ID of the newly created review.
   */
  crear: async (producto_id, cliente_id, calificacion, comentario, fecha = null) => {
    const [resultado] = await db.execute(
      'INSERT INTO Resena (producto_id, cliente_id, calificacion, comentario, fecha) VALUES (?, ?, ?, ?, ?)',
      [producto_id, cliente_id, calificacion, comentario, fecha]
    );
    return resultado.insertId;
  },

  /**
   * Deletes a review from the database by its ID.
   *
   * @param {number} id - The ID of the review to delete.
   * @returns {Promise<Object>} The result of the deletion operation.
   */

  eliminar: async (id) => {
    const [resultado] = await db.execute('DELETE FROM Resena WHERE id = ?', [id]);
    return resultado;
  },

  /**
   * Updates a review in the database by its ID.
   *
   * @param {number} id - The ID of the review to update.
   * @param {Object} datos - An object with the new values for the review, containing at least one of the following:
   *                         - calificacion: The new rating given to the product by the client.
   *                         - comentario: The new text of the review.
   * @returns {Promise<Object>} The result of the update operation.
   */
  actualizar: async (id, datos) => {
    const { calificacion, comentario } = datos;
    const [resultado] = await db.execute(
      'UPDATE Resena SET calificacion = ?, comentario = ? WHERE id = ?',
      [calificacion, comentario, id]
    );
    return resultado;
  }
};

module.exports = Resena;
