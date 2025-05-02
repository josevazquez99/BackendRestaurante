const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const productoRoutes = require('./routes/productRoutes');
app.use('/api/productos', productoRoutes);
const pedidoRoutes = require('./routes/orderRoutes');
app.use('/api/pedidos', pedidoRoutes);


// Ruta base (home)
app.get('/', (req, res) => {
  res.send('API Restaurante funcionando 🍽️');
});

module.exports = app;
