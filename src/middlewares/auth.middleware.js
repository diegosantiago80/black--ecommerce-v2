const passport = require('passport');


 /* Middleware que valida el JWT via estrategia 'current'.
 * Si no hay token válido, devuelve 401*/
const authenticate = passport.authenticate('current', { session: false });


 /* Para rutas de vistas: si no hay sesion redirige a /login en vez de devolver 401*/
const authenticateView = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user) => {
        if (err || !user) return res.redirect('/login');
        req.user = user;
        next();
    })(req, res, next);
};

/* Solo permite acceso a usuarios con role admin*/
const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            error: 'Acceso denegado: se requiere rol administrador',
        });
    }
    next();
};

/*Solo permite acceso a usuarios con role user*/
const isUser = (req, res, next) => {
    if (req.user?.role !== 'user') {
        return res.status(403).json({
            status: 'error',
            error: 'Acceso denegado: se requiere rol usuario',
        });
    }
    next();
};

module.exports = { authenticate, authenticateView, isAdmin, isUser };
