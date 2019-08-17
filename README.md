# Minimal JWT authentication with KoaJS and React

```
$ npm install
$ nohup node index.js &
$ cd client
$ yarn && yarn start
```

## Server usage
```javascript
// app is the koa application
// router is the main router
const configAuth = require('./auth');

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
const loginRoute = configAuth(app, authOptions);
router.post('/login', loginRoute);
```

## Client usage
```javascript
import AuthService from './AuthService';

// Configure authentication
AuthService.configure({
  loginUrl: 'http://localhost:3001/login',
  cookieOpts: { path: '/', maxAge: 5 * 1 },
  storageNS: 'user',
  putData: (username, token) => ({ username, token })
});

// Login user
AuthService.login(username.value, password.value)
  .then(data => { window.location.reload() }) // Success
  .catch(data => console.log(data) )          // Error message

// Get authentication data
AuthService.getData();

// Use JWT in fetch
const headers = AuthService.getHeaders();
fetch('bla', { headers }).then(...);

```
