const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/userModel');
const db = require('../config/db');
const { enviarCorreoRegistro } = require('../config/mailer'); 

const authController = {
  checkEmail: async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ mensaje: 'Email requerido' });
    }
  
    try {
      const usuario = await Usuario.buscarPorEmail(email);
      return res.status(200).json({ emailTaken: !!usuario });
    } catch (err) {
      console.error('Error al verificar el email:', err);
      res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
    }
  },

  registrar: async (req, res) => {
    const { nombre, email, password, rol } = req.body;
  
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
  
    try {
      console.log('Registro recibido', req.body);  // Depuración
  
      const usuarioExistente = await Usuario.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'El email ya está registrado' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const nuevoUsuarioId = await Usuario.crear({ nombre, email, password: hashedPassword, rol });
  
      if (rol === 'cliente') {
        await db.query('INSERT INTO Cliente (id) VALUES (?)', [nuevoUsuarioId]);
      } else if (rol === 'camarero') {
        await db.query('INSERT INTO Camarero (id) VALUES (?)', [nuevoUsuarioId]);
      } else if (rol === 'cocina') {
        await db.query('INSERT INTO Cocina (id) VALUES (?)', [nuevoUsuarioId]);
      } else if (rol === 'administrador') {
        await db.query('INSERT INTO Administrador (id) VALUES (?)', [nuevoUsuarioId]);
      }
      await enviarCorreoRegistro(email, nombre);
      res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    } catch (err) {
      console.error('Error en registro:', err);
      res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
    }
  },
  

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
    }

    try {
      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas (usuario)' });
      }

      const coincide = await bcrypt.compare(password, usuario.password);
      if (!coincide) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas (contraseña)' });
      }

      // Generamos el token con el ID y rol del usuario
      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET || 'secreto_super_seguro',
        { expiresIn: '1h' }
      );

      // 🔥 Modificamos la respuesta para incluir `usuario`
      res.json({
        mensaje: 'Login exitoso',
        token: token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (err) {
      console.error('Error en login:', err);
      res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
    }
  }
};

module.exports = authController;
