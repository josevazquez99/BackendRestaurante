const db = require('../config/db.js');

const Usuario = {
  crear: async (usuario) => {
    const [result] = await db.execute(
      'INSERT INTO Usuario (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [usuario.nombre, usuario.email, usuario.password, usuario.rol]
    );
    return result.insertId;
  },

  buscarPorEmail: async (email) => {
    const [rows] = await db.execute(
      'SELECT * FROM Usuario WHERE email = ?',
      [email]
    );
    return rows[0];
  },

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
