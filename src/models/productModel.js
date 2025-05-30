const db = require('../config/db');

const Producto = {
  obtenerTodos: async () => {
    const [filas] = await db.execute('SELECT * FROM Producto');
    return filas;
  },
  

  obtenerPorId: async (id) => {
    const [filas] = await db.execute('SELECT * FROM Producto WHERE id = ?', [id]);
    return filas[0];
  },

  crear: async (nombre, descripcion, precio, categoria) => {
    const [resultado] = await db.execute(
      'INSERT INTO Producto (nombre, descripcion, precio, categoria) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, categoria]
    );
    return resultado.insertId;
  },

  eliminar: async (id) => {
    const [resultado] = await db.execute('DELETE FROM Producto WHERE id = ?', [id]);
    return resultado;
  },
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
