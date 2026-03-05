# 🛍️ Black@ E-Commerce

Proyecto final del curso de Backend II. Aplicación de e-commerce desarrollada con Node.js, Express y MongoDB, aplicando arquitectura profesional por capas.

---

## 🚀 Tecnologías

- **Node.js** + **Express.js**
- **MongoDB Atlas** + **Mongoose**
- **Passport.js** + **JWT** (autenticación por cookies httpOnly)
- **Handlebars** (vistas del servidor)
- **Nodemailer** + **Gmail** (recuperación de contraseña)
- **Bcrypt** (encriptación de contraseñas)
- **Bootstrap 5** (estilos)
- **SweetAlert2** (alertas)

---

## 📁 Estructura del Proyecto

```
src/
├── config/         → Configuración centralizada (env, passport, mailer)
├── controllers/    → Lógica de cada dominio
├── dao/            → Acceso directo a la base de datos
├── dto/            → Transferencia de datos sin información sensible
├── middlewares/    → Autenticación y autorización por roles
├── models/         → Schemas de Mongoose
├── repositories/   → Patrón Repository (capa intermedia entre DAO y controllers)
├── routes/         → Definición de rutas API y vistas
└── utils/          → Helpers (bcrypt)
views/              → Plantillas Handlebars
public/             → Archivos estáticos (JS, imágenes)
```

---

## ⚙️ Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/black-ecommerce-v2.git
cd black-ecommerce-v2
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno — crear archivo `.env` en la raíz:
```
PORT=8080
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=tuSecretKey
EMAIL_USER=tucorreo@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

> Para `EMAIL_PASS` se requiere una **App Password de Gmail** (no la contraseña normal). Generala en: myaccount.google.com → Seguridad → Contraseñas de aplicaciones.

4. Iniciar el servidor
```bash
node app.js
```

5. Abrir en el navegador
```
http://localhost:8080
```

---

## 🔐 Roles de Usuario

| Rol | Permisos |
|-----|----------|
| `user` | Navegar productos, agregar al carrito, finalizar compra |
| `admin` | Crear, editar y eliminar productos |

Para asignar rol admin, modificar el campo `role` del usuario directamente en MongoDB Atlas.

---

## 📌 Endpoints principales

### Sesiones
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/sessions/register` | Registro de usuario |
| POST | `/api/sessions/login` | Login |
| GET | `/api/sessions/current` | Usuario actual (sin datos sensibles) |
| GET | `/api/sessions/logout` | Cerrar sesión |
| POST | `/api/sessions/forgot-password` | Enviar email de recuperación |
| POST | `/api/sessions/reset-password` | Restablecer contraseña |

### Productos
| Método | Ruta | Descripción | Rol requerido |
|--------|------|-------------|---------------|
| GET | `/api/products` | Listar productos (paginado) | — |
| GET | `/api/products/:pid` | Obtener producto | — |
| POST | `/api/products` | Crear producto | Admin |
| PUT | `/api/products/:pid` | Actualizar producto | Admin |
| DELETE | `/api/products/:pid` | Eliminar producto | Admin |

### Carritos
| Método | Ruta | Descripción | Rol requerido |
|--------|------|-------------|---------------|
| GET | `/api/carts/:cid` | Ver carrito | — |
| POST | `/api/carts/:cid/products/:pid` | Agregar producto | User |
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar producto | — |
| DELETE | `/api/carts/:cid/products` | Vaciar carrito | — |
| POST | `/api/carts/:cid/purchase` | Finalizar compra | User |

---

## 🛒 Lógica de Compra

Al finalizar una compra (`POST /api/carts/:cid/purchase`):

1. Se verifica el stock de cada producto del carrito
2. Los productos con stock suficiente se compran y se descuenta el stock
3. Se genera un **Ticket** con código único, fecha, total y email del comprador
4. Los productos sin stock suficiente **permanecen en el carrito**

---

## 📧 Recuperación de Contraseña

1. El usuario solicita recuperar su contraseña ingresando su email
2. Se envía un correo con un enlace que expira en **1 hora**
3. El usuario ingresa su nueva contraseña
4. El sistema valida que la nueva contraseña sea **diferente a la anterior**

