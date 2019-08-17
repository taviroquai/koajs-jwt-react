const jsonwebtoken = require('jsonwebtoken');
const jwtMiddleware = require('koa-jwt');

let config = {
  secret: 'jwt',
  maxAge: (60 * 60 * 12),
  unless: ['^\/'],
  onLogin: () => ({}),
  onCreateToken: (ctx, onLoginData, config) => {
    const token = jsonwebtoken.sign({
      data: onLoginData,
      exp: Math.floor(Date.now() / 1000) + config.maxAge,
    }, config.secret);
    ctx.body = { token, maxAge: config.maxAge };
  },
  onFail: (ctx, config) => { ctx.body = { message: config.invalidLoginMessage } },
  invalidLoginMessage: 'Invalid username/password'
};

const loginRoute = (ctx, next) => {
  const onLoginData = config.onLogin(ctx, next);
  if (!onLoginData) config.onFail(ctx, config);
  else config.onCreateToken(ctx, onLoginData, config);
};

const validateAuth = () => {
  return jwtMiddleware({ secret: config.secret })
    .unless({ path: config.unless })
};

const configure = (koa, options) => {
  config = Object.assign(config, options);
  koa.use(validateAuth());
  return loginRoute;
}

module.exports = { configure };