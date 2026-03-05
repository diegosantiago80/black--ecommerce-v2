const passport = require('passport');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies[config.cookieName];
    }
    return token;
};

const initializePassport = () => {
    passport.use('current', new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.jwtSecret,
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

module.exports = initializePassport;
