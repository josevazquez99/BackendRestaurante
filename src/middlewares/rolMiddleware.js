const verificarAdministrador = (req, res, next) => {
    const usuario = req.usuario;
  
    if (!usuario) {
      return res.status(401).json({ mensaje: 'No autorizado' });
    }
  
    if (usuario.rol !== 'administrador') {
      return res.status(403).json({ mensaje: 'Acceso denegado: Solo administradores' });
    }
  
    next();
  };
  
  module.exports = { verificarAdministrador };
  