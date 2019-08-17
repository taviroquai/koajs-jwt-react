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
const options = {
  secret: 'jwt',
  maxAge: (60 * 60 * 12),
  unless: [/^\/public/, /^\/login/],
  onLogin: ctx => {
    const { body } = ctx.request;
    const { username, password } = body;
    return username === 'admin' && password === 'admin' ? body : false;
  }
};
const loginRoute = Auth.server.configure(koa, options);
router.post('/login', loginRoute);

const port = 3001;
start(port, () => console.log('Server ready at port ' + port));