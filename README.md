# Restaurante Backend API 🍽️

Backend desarrollado en **Node.js** con **Express.js** para el Trabajo de Fin de Grado (TFG).  
Esta API gestiona funcionalidades del restaurante como usuarios, productos, pedidos, autenticación y más.

---

## 🚀 Tecnologías utilizadas

- **Node.js**
- **Express.js**
- **MySQL** (
- **Mongoose**
- **JWT** para autenticación
- **dotenv** para la configuración de variables de entorno
- **CORS**, **morgan**, **express-validator**, entre otros

---

## 📱 Funcionalidades principales

- Autenticación de usuarios (registro/login)
- Gestión de productos (CRUD)
- Gestión de pedidos
- Gestión de usuarios y roles
- Protección de rutas con tokens JWT
- Middleware de validación y manejo de errores

---

## 🛠️ Instalación y ejecución

1. **Clona el repositorio:**

```bash
git clone https://github.com/josevazquez99/BackendRestaurante.git
cd restaurante_backend_api
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Configura el archivo `.env`:**

```env
PORT=3000
DB_URI=tu_uri_de_base_de_datos
JWT_SECRET=tu_secreto
```

4. **Inicia el servidor:**

```bash
npm run dev
```

> El servidor correrá por defecto en `http://localhost:3000`

---

## 📂 Estructura del proyecto

```plaintext
src/
├── controllers/
│   └── productController.js
├── models/
│   └── product.js
├── routes/
│   └── productRoutes.js
├── middleware/
│   └── auth.js
├── config/
│   └── db.js
├── index.js
```

---

## 🔗 Recursos útiles

- [Node.js Docs](https://nodejs.org/en/docs/)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/) / [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT](https://jwt.io/introduction/)

---

## 🧑‍💻 Autor

Jose Antonio Vázquez  
TFG - Grado en Desarrollo de Aplicaciones Web y Multiplataforma

---

## 📜 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
