import Cookies from 'universal-cookie';

// Setup required dependencies
const cookies = new Cookies();

let config = {
  loginUrl: 'http://localhost:3001/login',
  cookieOpts: { path: '/', maxAge: 5 * 1 },
  storageNS: 'user',
  putData: (username, token) => ({ username, token })
}

const configure = (options) => {
  options = Object.assign(config, options);
}

function logout() {
  const previous = cookies.get(config.storageNS);
  cookies.remove(config.storageNS);
  return previous;
}

function login(username, password) {
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({ username, password });
  const requestOptions = { method: 'POST', headers, body };
  return fetch(config.loginUrl, requestOptions)
    .then(res => {
      if (!res.ok) return Promise.reject('Service unavailable');
      return res;
    })
    .then(res => res.json())
    .then(data => {
      if (!data.token) {
        return Promise.reject(data);
      } else {
        config.cookieOpts.maxAge = data.maxAge;
        cookies.set(
          config.storageNS,
          config.putData(username, data.token),
          config.cookieOpts
        );
      };
    });
}

function getData() {
  return cookies.get(config.storageNS) || {};
}

function getHeaders() {
  const data = getData();
  const headers = {};
  if (data) headers['Authorization'] = `Bearer ${data.token}`;
  return headers;
}

export default { configure, login, logout, getData, getHeaders }