import React, { useState } from 'react';
import LoginForm from './LoginForm';
import AuthService from './AuthService';
import ResourceService from './ResourceService';
import './App.css';

// Set authentication options
AuthService.configure({
  loginUrl: 'http://localhost:3001/login',
  cookieOpts: { path: '/', maxAge: 5 * 1 },
  storageNS: 'user',
  putData: (username, token) => ({ username, token })
});

function App() {
  const [data] = useState(AuthService.getData());
  const [error, setError] = useState('');
  const [resource, setResource] = useState('');

  // Login action
  const loginAction = (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;

    // Remote login
    AuthService.login(username.value, password.value)
    
    // Success
    .then(data => {
      window.location.reload();
    })
    
    // Error message
    .catch(data => {
      setError(data.message || 'Service unavailable');
    });
  }

  // Logout action
  const logoutAction = () => {
    AuthService.logout();
    window.location.reload(true);
  }

  // Test protected resource
  const actionGetResource = (uri) => {
    ResourceService.remote(uri)
      .then(res => res.text())
      .then(data => setResource(data));
  }
  
  return (
    <div className="App">
      
      { !data.username ? (
        <LoginForm
          onSubmit={loginAction.bind(this)}
          error={error}
        />
      ) : (
        <button onClick={logoutAction}>Logout { data.username }</button>
      )}
      
      <button onClick={e => actionGetResource('/public')}>public</button>&nbsp;
      <button onClick={e => actionGetResource('/protected')}>protected</button>&nbsp;
      { resource && <p>Resource: { resource }</p> }
    </div>
  );
}

export default App;
