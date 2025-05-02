const db = require('../config/db');

const Producto = {
  obtenerTodos: async () => {
    const [filas] = await db.query('SELECT * FROM Producto');
    return filas;
  },

  crear: async (nombre, descripcion, precio, categoria) => {
    const [resultado] = await db.query(
      'INSERT INTO Producto (nombre, descripcion, precio, categoria) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, categoria]
    );
    return resultado.insertId;
  },

  eliminar: async (id) => {
    await db.query('DELETE FROM Producto WHERE id = ?', [id]);
  },
  actualizar: (id, datos) => {
    const { nombre, descripcion, precio, categoria } = datos;
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE Producto SET nombre = ?, descripcion = ?, precio = ?, categoria = ? WHERE id = ?',
        [nombre, descripcion, precio, categoria, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
};

module.exports = Producto;
