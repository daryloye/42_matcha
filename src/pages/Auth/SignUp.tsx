import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function SignUp() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRetype, setPasswordRetype] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (password !== passwordRetype) {
      setErrorMsg('Passwords do not match');
    } else if (password === passwordRetype) {
      setErrorMsg('');
    }
  }, [password, passwordRetype]);

  const handleSubmit = () => {
    if (errorMsg !== '') return;

    // Simulate /auth/signup request
    if (password === 'a') {
      setErrorMsg('Password is too weak');
    } else {
      setErrorMsg('');
      navigate('/dashboard');
    }
  };

  return (
    <div className='page-wrapper-center'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <p className='error-message'>{errorMsg}</p>

        <form>
          <input
            type='text'
            id='firstname'
            value={firstname}
            onChange={(event) => setFirstname(event.target.value.trim())}
            placeholder='First name'
            required
          />

          <input
            type='text'
            id='lastname'
            value={lastname}
            onChange={(event) => setLastname(event.target.value.trim())}
            placeholder='Last name'
            required
          />

          <input
            type='email'
            id='email'
            value={email}
            onChange={(event) => setEmail(event.target.value.trim())}
            placeholder='Email'
            required
          />

          <input
            type='text'
            id='username'
            value={username}
            onChange={(event) => setUsername(event.target.value.trim())}
            placeholder='Username'
            required
          />

          <input
            type='password'
            id='password'
            value={password}
            onChange={(event) => setPassword(event.target.value.trim())}
            placeholder='Password'
            required
          />

          <input
            type='password'
            id='password-retype'
            value={passwordRetype}
            onChange={(event) => setPasswordRetype(event.target.value.trim())}
            placeholder='Retype Password'
            required
          />

          <button type='button' onClick={handleSubmit}>
            Create Account
          </button>
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
