'use strict';

const JWTStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../api/config/development');
const userModel = require('../storage/models/users').userModel;


// const config = require('../api/config/' + process.env.NODE_ENV);

// Hooks the JWT Strategy.
function hookJWTStrategy(passport) {
    var options = {};

    // options.secretOrKey = config.keys.secret;
    options.secretOrKey = config.keys.secret;
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    options.ignoreExpiration = false;

    passport.use(new JWTStrategy(options, function(JWTPayload, callback) {
      userModel.findOne({
        email: JWTPayload.email
      }, function (err, user) {
        if (err) return console.error(err);
        console.log(user);
        if(!user) {
            callback(null, false);
            return;
        }
        callback(null, user);
      });
    }));
}


module.exports = hookJWTStrategy;
