import { useState } from 'react';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  
  return (
    <div className='background-image'>
      <h1>Hello World</h1>

      <div className='login-container'>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
    </div>
  )
}