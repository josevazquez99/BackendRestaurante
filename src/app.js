// app.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Configurar conexión a MySQL
const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

connection.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    process.exit(1); // Salir si no se conecta
  }
  console.log('Conectado a la base de datos MySQL');
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productRoutes');
const pedidoRoutes = require('./routes/orderRoutes');
const carritoRoutes = require('./routes/cartRoutes');
const resenaRoutes = require('./routes/reviewRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/resenas', resenaRoutes);

// Ruta base (home)
app.get('/', (req, res) => {
  res.send('API Restaurante funcionando 🍽️');
});

// Exportar app y la conexión para usar en controladores
module.exports = { app, connection };
