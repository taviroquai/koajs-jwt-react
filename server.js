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

// Export to re-use
module.exports = { koa: app, router };