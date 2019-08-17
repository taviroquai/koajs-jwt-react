#koajs-jwt-react

Minimal JWT authentication with KoaJS and React  

Checkout the **demo** folder to see how it can be used.

## Server usage
```javascript

// app is the koa application
// router is the main router
const Auth = require('koajs-jwt-react');

// Add authentication
const options = {
  secret: 'jwt',
  maxAge: (60 * 60 * 12),
  unless: [/^\/login/],
  onLogin: ctx => {
    const { body } = ctx.request;
    const { username, password } = body; // Use koa-bodyparser!
    return username === 'admin' && password === 'admin' ? body : false;
  }
};
const loginRoute = Auth.server.configure(app, options);
router.post('/login', loginRoute);
```

## Client usage
```javascript
import AuthService from 'koajs-jwt-react';

// Configure authentication
const options = {
  loginUrl: 'http://localhost:3001/login',
  cookieOpts: { path: '/', maxAge: 5 * 1 },
  storageNS: 'user',
  putData: (username, token) => ({ username, token })
}
Auth.client.configure(options);

// Login user
Auth.client.login(username, password)
  .then(data => window.location.reload()) // Success
  .catch(data => console.log(data) )      // Error message

// Get authentication data
Auth.client.getData();

// Use JWT in fetch
const headers = Auth.client.getHeaders();
fetch('bla', { headers })
  .then(...)  // Success - user is still logged
  .catch(...) // Http 401/403 - user is logged out

// Logout user
Auth.client.logout();

```
