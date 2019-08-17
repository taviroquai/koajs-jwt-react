import Auth from './lib';

const apiUrl = '//localhost:3001';

function remote(uri, body = '', headers = {}) {
  const url = apiUrl + uri;
  headers = Object.assign(headers, Auth.client.getHeaders());
  const requestOptions = { headers };
  if (body) requestOptions['body'] = body;

  // Wrap in optional resolve promise
  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
    .then(res => {

      // Log user out on expired cookie
      if ([401, 403].indexOf(res.status) !== -1) {
        Auth.client.logout();
        reject(res);
      } else resolve(res);
    })
    .catch(err => console.log(err));
  });
}

export default { remote }