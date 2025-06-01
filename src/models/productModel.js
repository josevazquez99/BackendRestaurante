const db = require('../config/db');

const Producto = {
  /**
   * Retrieves all products from the database.
   *
   * @returns {Promise<Array<{id: number, nombre: string, descripcion: string, precio: number, categoria: string}>>}
   *          A list of products with their respective IDs, names, descriptions, prices, and categories.
   */
  obtenerTodos: async () => {
    const [filas] = await db.execute('SELECT * FROM Producto');
    return filas;
  },
  

  /**
   * Retrieves a single product from the database by its ID.
   *
   * @param {number} id - The ID of the product to retrieve.
   * @returns {Promise<Object>} The product with the specified ID, or null if it doesn't exist.
   */
  obtenerPorId: async (id) => {
    const [filas] = await db.execute('SELECT * FROM Producto WHERE id = ?', [id]);
    return filas[0];
  },

  /**
   * Creates a new product in the database.
   *
   * @param {string} nombre - The name of the product.
   * @param {string} descripcion - The description of the product.
   * @param {number} precio - The price of the product.
   * @param {string} categoria - The category of the product.
   * @returns {Promise<number>} The ID of the created product.
   */
  crear: async (nombre, descripcion, precio, categoria) => {
    const [resultado] = await db.execute(
      'INSERT INTO Producto (nombre, descripcion, precio, categoria) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, categoria]
    );
    return resultado.insertId;
  },

  /**
   * Deletes a product from the database by its ID.
   *
   * @param {number} id - The ID of the product to delete.
   * @returns {Promise<Object>} The result of the deletion operation.
   */
  eliminar: async (id) => {
    const [resultado] = await db.execute('DELETE FROM Producto WHERE id = ?', [id]);
    return resultado;
  },
  /**
   * Updates a product in the database by its ID.
   *
   * @param {number} id - The ID of the product to update.
   * @param {Object} datos - An object with the properties to update.
   *                         The properties supported are: nombre, descripcion, precio, categoria.
   * @returns {Promise<Object>} The result of the update operation.
   */
  actualizar: async (id, datos) => {
    const { nombre, descripcion, precio, categoria } = datos;
    const [resultado] = await db.execute(
      "UPDATE Producto SET nombre = ?, descripcion = ?, precio = ?, categoria = ? WHERE id = ?",
      [nombre, descripcion, precio, categoria, id]
    );

    return resultado; 
  }

};

module.exports = Producto;
