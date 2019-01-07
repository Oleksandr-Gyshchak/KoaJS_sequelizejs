const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const json = require('koa-json')

require('./config/pg.config');


const passport = require('koa-passport')
require('./config/passport.config')(passport);

const authenticationCheck = require('./middleware/auth')

const app = new Koa();
const router = new Router();

const userController = require('./controllers/user');

app.use(json());
// Use the bodyparser middlware
app.use(BodyParser());

app.use(passport.initialize());

//routes
//router.get('/', userController.getUserProfile);

router.post('/register', userController.createUser);
router.post('/login', userController.validateUser);
router.get('/profile', authenticationCheck, userController.getUserProfile);






// error
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message
    };
  }
})

app.use(router.routes());
app.use(router.allowedMethods());



const portNumber = 3000;
app.listen(
  portNumber,
  () => console.log(`listening port: ${portNumber}`)
);