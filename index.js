const { koa, router } = require('./server');
const { configAuth, loginRoute, validateAuth } = require('./auth');

// Unprotected middleware
router.get('/public', ctx => {
  ctx.body = 'unprotected\n';
});

// Add authentication
configAuth({
  secret: 'jwt',
  maxAge: (60 * 60 * 12),
  validate: body => body.password !== 'admin' ? false : body
});
router.post('/login', loginRoute);
router.get('/protected', validateAuth);

// Add other protected routes
router.get('/protected', (ctx) => {
  ctx.body = 'protected\n';
});

// Add router
koa.use(router.routes());
koa.use(router.allowedMethods());

// Start server
const httpPort = 3001;
koa.listen(httpPort, () => console.log('Server ready at port ' + httpPort));
