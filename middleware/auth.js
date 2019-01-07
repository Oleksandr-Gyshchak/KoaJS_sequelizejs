const passport = require('passport');

module.exports = async function (ctx, next) {
    try {
        await passport.authenticate('jwt', async function (err, user, errMessage) {
            if (user) {
                ctx.currentUser = user;
                await next();

            } else {
                ctx.status = 400;
                ctx.body = {
                    success: false,
                    error: err || errMessage
                }
            }
        })(ctx)

    } catch (e) {
        console.log(e)
        ctx.body = {
            success: false,
            error: e
        }
    }
};