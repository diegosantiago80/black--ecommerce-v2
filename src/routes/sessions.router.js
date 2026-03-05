const { Router } = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { register, login, current, logout, forgotPassword, resetPassword } = require('../controllers/sessions.controller');

const router = Router();

router.post('/register',        register);
router.post('/login',           login);
router.get('/current',          authenticate, current);
router.get('/logout',           logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);

module.exports = router;
