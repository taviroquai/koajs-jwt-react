import React from 'react';

function LoginForm(props) {
  const { onSubmit, error } = props;
  return (
    <form onSubmit={onSubmit}>
      <input name="username" defaultValue="admin" type="text" title="username" />
      <input name="password" defaultValue="admin" type="password" title="password" />
      <button type="submit">Login</button>
      { error && <p>{ error }</p>}
    </form>
  );
}

export default LoginForm;
