'use strict';

const JWTStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// const config = require('../api/config/' + process.env.NODE_ENV);
const config = require('../api/config/development');

// Hooks the JWT Strategy.
function hookJWTStrategy(passport) {
    var options = {};

    // options.secretOrKey = config.keys.secret;
    options.secretOrKey = 'testkey';
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    options.ignoreExpiration = false;

    passport.use(new JWTStrategy(options, function(JWTPayload, callback) {
        db.Users.findOne({ where: { email: JWTPayload.email }, raw: true })
            .then(function(user) {
                if(!user) {
                    callback(null, false);
                    return;
                }

                callback(null, user);
            });
    }));
}


module.exports = hookJWTStrategy;
