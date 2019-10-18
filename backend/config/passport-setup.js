const passport = require('passport');
const User = require('../models/authentication/user-model');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const keys = require('../config/keys');

passport.use(User.createStrategy());

passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: keys.JWT.secretKey,
        algorithms: keys.JWT.algorithms
    },
    (payload, done) => {
        done(null, payload);
      }
    )
);