import Cookies from 'universal-cookie';

// Setup required dependencies
const cookies = new Cookies();

function logout() {
  cookies.remove('user');
  window.location.reload(true);
}

function post(url, body, cb, headers = { 'Content-Type': 'application/json' }) {
  const requestOptions = {
    method: 'POST',
    headers,
    body
  };
  return fetch(url, requestOptions)
    .then(res => {
      return res.text().then(text => {
        const data = text && JSON.parse(text);
        if (!res.ok) {
          if ([401, 403].indexOf(res.status) !== -1) return logout();
          
          const error = (data && data.message) || res.statusText;
          return Promise.reject(error);
        }
        return data;
      });
    })
    .then(cb);
}

export default { logout, post, cookies }