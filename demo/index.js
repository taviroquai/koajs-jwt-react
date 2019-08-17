const { koa, router, start } = require('./server');
const Auth = require('../src');

// Unprotected route
router.get('/public', ctx => {
  ctx.body = 'unprotected\n';
});

// Other route
router.get('/protected', (ctx) => {
  const { username } = ctx.state.user.data;
  ctx.body = `protected. access by ${username}\n`;
});

// Add authentication
const authOptions = {
  secret: 'jwt',
  maxAge: (60 * 60 * 12),
  unless: [/^\/public/, /^\/login/],
  validateCreateRequest: request => {
    const { body } = request;
    return body.password !== 'admin' ? false : body;
  }
};
const loginRoute = Auth.server.configure(koa, authOptions);
router.post('/login', loginRoute);

const port = 3001;
start(port, () => console.log('Server ready at port ' + port));