const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/index').User;

const secretWord = 'sercretWordForDecoding';

module.exports = async function (passport) {
    try {
        var opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
            secretOrKey: secretWord
        };
        await passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
            const user = await UserModel.findOne({
                where: {
                    username: jwt_payload.username
                }
            })

            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'No user found'
                });
            }

        }));
    } catch (e) {
        return done(e, false);
    }

}