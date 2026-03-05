const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');
const passport = require('passport');
const path = require('path');

const config = require('./src/config/config');
const initializePassport = require('./src/config/passport.config');

// Routers
const sessionsRouter  = require('./src/routes/sessions.router');
const productsRouter  = require('./src/routes/products.router');
const cartsRouter     = require('./src/routes/carts.router');
const viewsRouter     = require('./src/routes/views.router');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport 
initializePassport();
app.use(passport.initialize());

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas API
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts',    cartsRouter);

// Rutas de vistas
app.use('/', viewsRouter);

// Conexión a MongoDB
mongoose
    .connect(config.mongoUri)
    .then(() => {
        console.log('✅ Conectado a MongoDB Atlas');
        app.listen(config.port, () => {
            console.log(`Servidor corriendo en http://localhost:${config.port}`);
        });
    })
    .catch(err => console.error('Error conectando a MongoDB:', err));
