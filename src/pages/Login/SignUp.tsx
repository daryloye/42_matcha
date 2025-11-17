import { useState } from 'react';
import './Login.css';

export default function SignUp() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='login-container'>
      <h1>Welcome to Matcha</h1>

      <form className='form-container'>
        <input
          className='login-input'
          type="text"
          id="firstname"
          value={firstname}
          onChange={(event) => setFirstname(event.target.value)}
          placeholder="First name"
          required
        />

        <input
          className='login-input'
          type="text"
          id="lastname"
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
          placeholder="Last name"
          required
        />

        <input
          className='login-input'
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />

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
          Create Account
        </button>
      </form>

      <div>
        <a href='/'>Back to Login</a>
      </div>
    </div>
  )
}