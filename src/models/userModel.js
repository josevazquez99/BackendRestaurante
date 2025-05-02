const db = require('../config/db');

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
  }
};

module.exports = Usuario;
