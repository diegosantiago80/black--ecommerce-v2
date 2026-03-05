const { Router } = require('express');
const { authenticateView } = require('../middlewares/auth.middleware');
const { renderProducts, renderProductDetail, renderCart } = require('../controllers/views.controller');

const router = Router();

// Rutas públicas
router.get('/',                  (req, res) => res.redirect('/login'));
router.get('/login',             (req, res) => res.render('login'));
router.get('/register',          (req, res) => res.render('register'));
router.get('/forgot-password',   (req, res) => res.render('forgot-password'));
router.get('/reset-password',    (req, res) => res.render('reset-password'));

// Rutas protegidas
router.get('/products',          authenticateView, renderProducts);
router.get('/products/:pid',     authenticateView, renderProductDetail);
router.get('/cart',              authenticateView, renderCart);

module.exports = router;
