const jsonwebtoken = require('jsonwebtoken');

let config = {
  secret: 'jwt',
  maxAge: (60 * 60 * 12),
  validate: () => ({})
};

const configAuth = (userConfig) => {
  config = Object.assign({}, userConfig);
}

const loginRoute = (ctx, next) => {
  if (ctx.url.match(/login/)) {
    const { body } = ctx.request;
    const validatedData = config.validate(body);
    if (!validatedData) return ctx.body = { message: 'Invalid password' };

    // Create JWT token
    const token = jsonwebtoken.sign({
      data: validatedData,
      exp: Math.floor(Date.now() / 1000) + config.maxAge,
    }, config.secret);
    ctx.body = { token, maxAge: config.maxAge };
  } else return next();
};

const validateAuth = (ctx, next) => {
  const token = ctx.cookies.get('user');
  if (!token) return ctx.status = 401;
  
  try {
    ctx.state['user'] = jsonwebtoken.verify(token, config.secret);
    return next();
  } catch (e) {
    ctx.status = 401;
  }
};

module.exports = { configAuth, loginRoute, validateAuth };