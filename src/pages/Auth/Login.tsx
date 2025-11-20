import { useState } from 'react';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    if (errorMsg !== '') return;

    if (username === '' || password === '') return;

    // simulate /auth/login request
    if (username === 'a' && password === 'a') {
      setErrorMsg('Incorrect email or password');
    } else {
      setErrorMsg('');
      console.log("Logged in");
    }
  }

  return (
    <div className='page-wrapper-center'>
      <div className='login-container'>
        <h1>Welcome to Matcha</h1>

        <p className='error-message'>{errorMsg}</p>

        <form className='login-form-container'>
          <input
            className='login-input'
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value.trim())}
            placeholder="Username"
            required
          />

          <input
            className='login-input'
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value.trim())}
            placeholder="Password"
            required
          />

          <button
            type='button'
            onClick={handleLogin}
          >
            Login
          </button>
        </form>

        <div>
          <a href='./signup'>Create Account</a>
        </div>
      </div>
    </div>
  )
}