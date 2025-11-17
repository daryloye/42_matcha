import { useState } from 'react';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='login-container'>
      <h1>Welcome to Matcha</h1>

      <form className='form-container'>
        <input
          className='login-input'
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          required
        />

        <input
          className='login-input'
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />

        <button className='login-button'>
          Login
        </button>
      </form>

      <div>
        <a href='./SignUp'>Create Account</a>
      </div>
    </div>
  )
}