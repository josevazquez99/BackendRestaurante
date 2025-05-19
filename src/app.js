const express = require('express');
const cors = require('cors');
// Ya no necesitas importar mysql aquí
require('dotenv').config();

const app = express();

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

module.exports = app;
