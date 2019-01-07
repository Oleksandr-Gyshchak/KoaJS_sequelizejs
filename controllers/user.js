var UserModel = require('../models/index').User;
const secretWord = 'sercretWordForDecoding';
var jwt = require('jsonwebtoken');

const passport = require('passport');

const createUser = async function (ctx) {
    try {

        let userName = ctx.request.body.username;

        let isUniqueUsername = await UserModel.findOne({
            where: {
                username: userName
            }
        });

        if (!isUniqueUsername) {
            const userItem = {
                username: userName,
                password: ctx.request.body.password
            }

            let createdUser = await UserModel.create(userItem);

            ctx.status = 201;
            ctx.body = {
                success: true,
                createdUser: createdUser
            }

        } else {
            let errorMessage = userName + ' already taken';

            ctx.status = 409;
            ctx.body = {
                success: false,
                error: errorMessage
            }
        }

    } catch (err) {
        console.log(err)
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: err.errors
        }
    }


};


const validateUser = async function (ctx) {
    try {

        if (!ctx.request.body) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                error: "Invalid request data"
            }
        }

        const queryUserName = {
            where: {
                username: ctx.request.body.username
            }
        };

        let user = await UserModel.findOne(queryUserName);
        if (!user.length) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                error: "User not found"
            }
        }

        const isMatchPass = await user.validPassword(ctx.request.body.password);

        if (isMatchPass) {
            const token = jwt.sign(user.toJSON(), secretWord, {
                expiresIn: '10m'
            });

            return ctx.body = {
                success: true,
                token: "JWT " + token
            }
        } else {
            ctx.status = 400;
            ctx.body = {
                success: false,
                error: 'Wrong password'
            }
        }

    } catch (err) {
        console.log(err);
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: err
        }
    }

};


const getUserProfile = async function (ctx, next) {

    console.log('AuthorizationResult - Success');

    ctx.body = {
        success: true,
        userProfile: JSON.stringify(ctx.currentUser || "")
    }



    /* try {
         await passport.authenticate('jwt', function (err, user, errMessage) {
             if (user) {
                 ctx.body = {
                     success: true,
                     userProfile: JSON.stringify(user)
                 }

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

     */
};


module.exports = {
    createUser,
    validateUser,
    getUserProfile
};