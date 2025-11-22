import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === '' || password === '') {
      setErrorMsg('Please enter email and password');
    }

    // simulate /auth/login request
    else if (username === 'a' && password === 'a') {
      setErrorMsg('Incorrect email or password');
    }
    else {
      setErrorMsg('');
      navigate('/dashboard');
    }
  }

  return (
    <div className='page-wrapper-center'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <p className='error-message'>{errorMsg}</p>

        <form>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value.trim())}
            placeholder="Username"
            required
          />

          <input
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

        <Link to='/signup'>Create Account</Link>
      </div>
    </div>
  )
}