const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const cartRepository = require('../repositories/cart.repository');
const UserDTO = require('../dto/user.dto');
const { createHash, isValidPassword } = require('../utils/bcrypt');
const config = require('../config/config');
const transporter = require('../config/mailer.config');

// POST /api/sessions/register
const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const exists = await userRepository.getByEmail(email);
        if (exists) return res.status(400).json({ status: 'error', error: 'El email ya está registrado' });

        const cart = await cartRepository.create();
        const newUser = await userRepository.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cart._id,
        });

        res.status(201).json({ status: 'success', payload: new UserDTO(newUser) });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// POST /api/sessions/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.getByEmail(email);
        if (!user) return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });

        if (!isValidPassword(user, password))
            return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });

        const tokenPayload = {
            id:    user._id,
            email: user.email,
            role:  user.role,
            cart:  user.cart,
        };

        const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: config.jwtExpiration });

        res
            .cookie(config.cookieName, token, { httpOnly: true })
            .json({ status: 'success', message: 'Login exitoso' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// GET /api/sessions/current  — requiere autenticacion
const current = async (req, res) => {
    try {
        const user = await userRepository.getById(req.user.id);
        if (!user) return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });

        res.json({ status: 'success', payload: new UserDTO(user) });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// GET /api/sessions/logout
const logout = (req, res) => {
    res.clearCookie(config.cookieName).redirect('/login');
};

// POST /api/sessions/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userRepository.getByEmail(email);
        // Por seguridad, siempre responde igual aunque el email no exista
        if (!user) {
            return res.json({ status: 'success', message: 'Si el email existe, recibirás un correo' });
        }

        // Token especial para reset, expira en 1 hora
        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            config.jwtSecret,
            { expiresIn: '1h' }
        );

        const resetLink = `http://localhost:${config.port}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: `"Black@ E-Commerce" <${config.email.user}>`,
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2>Recuperar contraseña</h2>
                    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                    <p>Hacé clic en el botón para crear una nueva. El enlace expira en <strong>1 hora</strong>.</p>
                    <a href="${resetLink}"
                       style="display:inline-block; padding:12px 24px; background:#343a40; color:white;
                              text-decoration:none; border-radius:4px; margin:20px 0;">
                        Restablecer contraseña
                    </a>
                    <p style="color:#999; font-size:0.85rem;">
                        Si no solicitaste esto, podés ignorar este correo.
                    </p>
                </div>
            `,
        });

        res.json({ status: 'success', message: 'Si el email existe, recibirás un correo' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// POST /api/sessions/reset-password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token) return res.status(400).json({ status: 'error', error: 'Token requerido' });

        // Verificar y decodificar el token
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwtSecret);
        } catch (err) {
            // Token expirado o inválido
            return res.status(400).json({
                status: 'error',
                error: err.name === 'TokenExpiredError'
                    ? 'El enlace expiró. Solicitá uno nuevo.'
                    : 'Token inválido',
            });
        }

        const user = await userRepository.getById(decoded.id);
        if (!user) return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });

        // Verificar que la nueva contraseña sea diferente a la anterior
        if (isValidPassword(user, newPassword)) {
            return res.status(400).json({
                status: 'error',
                error: 'La nueva contraseña no puede ser igual a la anterior',
            });
        }

        await userRepository.update(user._id, { password: createHash(newPassword) });

        res.json({ status: 'success', message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

module.exports = { register, login, current, logout, forgotPassword, resetPassword };
