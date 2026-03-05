require('dotenv').config();

const config = {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET || 'secretKeyCoder',
    jwtExpiration: '24h',
    cookieName: 'coderCookieToken',
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
};

module.exports = config;
