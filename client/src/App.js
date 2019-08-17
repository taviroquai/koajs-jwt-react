import React, { useState } from 'react';
import LoginForm from './LoginForm';
import AuthService from './AuthService';
import './App.css';

const apiUrl = '//localhost:3001';
const cookieOpts = { path: '/', maxAge: 5 * 1 };

function login(username, password, setError) {
  const body = JSON.stringify({ username, password });
  
  AuthService.post(apiUrl + '/login', body, data => {
    if (data.message) return setError(data.message || '');

    // OK!
    cookieOpts.maxAge = data.maxAge;
    AuthService.cookies.set('user', data.token, cookieOpts);
    window.location.reload();
  }).catch(error => {
    setError(error);
  });
}

function App() {
  const [user] = useState(AuthService.cookies.get('user'));
  const [error, setError] = useState('');

  const loginAction = (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;
    login(username.value, password.value, setError);
  }

  const logoutAction = () => AuthService.logout();

  return (
    <div className="App">
      
      { !user ? (
        <LoginForm
          onSubmit={loginAction.bind(this)}
          error={error}
        />
      ) : (
        <button onClick={logoutAction}>Logout</button>
      )}
      
      <a href={apiUrl + '/public'}>public</a>&nbsp;
      <a href={apiUrl + '/protected'}>protected</a>
    </div>
  );
}

export default App;
