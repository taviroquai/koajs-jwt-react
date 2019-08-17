#koajs-jwt-react

Minimal JWT authentication with KoaJS and React

## Server usage
```javascript
// app is the koa application
// router is the main router
const Auth = require('koajs-jwt-react');

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
const loginRoute = Auth.server.configure(app, authOptions);
router.post('/login', loginRoute);
```

## Client usage
```javascript
import AuthService from 'koajs-jwt-react';

// Configure authentication
Auth.client.configure({
  loginUrl: 'http://localhost:3001/login',
  cookieOpts: { path: '/', maxAge: 5 * 1 },
  storageNS: 'user',
  putData: (username, token) => ({ username, token })
});

// Login user
Auth.client.login(username.value, password.value)
  .then(data => { window.location.reload() }) // Success
  .catch(data => console.log(data) )          // Error message

// Get authentication data
Auth.client.getData();

// Use JWT in fetch
const headers = Auth.client.getHeaders();
fetch('bla', { headers })
  .then(...) // Success - user is still logged
  .catch(...) // Http 401/403 - user is logged out

// Logout user
Auth.client.logout();

```
