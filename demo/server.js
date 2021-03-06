const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

// Koa instance
const app = new Koa();
app.use(bodyParser());
app.use(cors());

// Create router
const router = new Router();

// Start listening
const start = (port, cb) => {
  
  // Add router
  app.use(router.routes());
  app.use(router.allowedMethods());

  // Start server
  app.listen(port, cb);
}

// Export to re-use
module.exports = { koa: app, router, start };