const db = require('../config/db.js');

const Usuario = {
  /**
   * Creates a new user in the database.
   *
   * @param {Object} usuario - The user to be created, with properties
   *                           `nombre`, `email`, `password`, and `rol`.
   * @returns {Promise<number>} The ID of the newly created user.
   * @throws {Error} If any database operation fails.
   */
  crear: async (usuario) => {
    const [result] = await db.execute(
      'INSERT INTO Usuario (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [usuario.nombre, usuario.email, usuario.password, usuario.rol]
    );
    return result.insertId;
  },

  /**
   * Searches for a user in the database by their email.
   *
   * @param {string} email - The email of the user to search for.
   * @returns {Promise<Object|null>} The user object if found, otherwise null.
   * @throws {Error} If any database operation fails.
   */

  buscarPorEmail: async (email) => {
    const [rows] = await db.execute(
      'SELECT * FROM Usuario WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  /**
   * Checks the existence of a table in the database by its ID.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<void>}
   * @throws {Error} If any database operation fails.
   */
  comprobarMesa: async (req, res) => {
    const mesa_id = req.params.id;  
    try {
      const [mesa] = await db.execute('SELECT * FROM Mesa WHERE id = ?', [mesa_id]);
      if (!mesa.length) {
        return res.status(404).json({ mensaje: 'Mesa no encontrada' });
      }
      return res.json(mesa[0]);  
    } catch (err) {
      console.error('Error al comprobar la mesa:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
    }
  },
};

module.exports = Usuario;
