const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     
    pass: process.env.EMAIL_PASSWORD, 
  }
});

const enviarCorreoRegistro = async (destinatario, nombre) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: '¡Bienvenido a nuestra plataforma!',
    text: `Hola ${nombre}, gracias por registrarte. ¡Estamos felices de tenerte con nosotros!`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { enviarCorreoRegistro };
