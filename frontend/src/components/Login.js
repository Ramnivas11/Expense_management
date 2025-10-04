import React, { useState } from 'react';
import API, { setAuth } from '../services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // set auth first
      setAuth(username, password);

      // test login and get role
      const res = await API.get('/users/me/role');
      const role = res.data.role;

      onLogin(username, password, role); // pass role to App
    } catch (err) {
      alert('Invalid credentials or server error');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Login</h3>
      <input placeholder="Username" className="form-control mt-2" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" className="form-control mt-2" onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-primary mt-3" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
