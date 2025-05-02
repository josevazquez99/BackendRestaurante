const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const tokenLimpio = token.split(' ')[1]; 

  jwt.verify(tokenLimpio, process.env.JWT_SECRET || 'secreto_super_seguro', (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }

    req.usuario = decoded;  
    next();
  });
};

module.exports = { verificarToken };
