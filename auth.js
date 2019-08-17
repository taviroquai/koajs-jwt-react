const jsonwebtoken = require('jsonwebtoken');
const jwtMiddleware = require('koa-jwt');

let config = {
  secret: 'jwt',
  maxAge: (60 * 60 * 12),
  unless: ['^\/'],
  validateCreateRequest: () => ({}),
  invalidCreateMessage: 'Invalid password'
};

const loginRoute = (ctx, next) => {
  const validatedData = config.validateCreateRequest(ctx.request);
  if (!validatedData) return ctx.body = { message: config.invalidCreateMessage };

  // Create JWT token
  const token = jsonwebtoken.sign({
    data: validatedData,
    exp: Math.floor(Date.now() / 1000) + config.maxAge,
  }, config.secret);
  ctx.body = { token, maxAge: config.maxAge };
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

module.exports = configure;