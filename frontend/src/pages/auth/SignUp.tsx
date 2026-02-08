import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ActionButton } from '../../components/ActionButton';
import { TextInput } from '../../components/TextInput';
import './auth.css';

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
    <div className='page-wrapper'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <p className='error-message'>{errorMsg}</p>

        <form>
          <TextInput
            type='text'
            value={firstname}
            onChange={setFirstname}
            placeholder='First name'
          />

          <TextInput
            type='text'
            value={lastname}
            onChange={setLastname}
            placeholder='Last name'
          />

          <TextInput
            type='email'
            value={email}
            onChange={setEmail}
            placeholder='Email'
          />

          <TextInput
            type='text'
            value={username}
            onChange={setUsername}
            placeholder='Username'
          />

          <TextInput
            type='password'
            value={password}
            onChange={setPassword}
            placeholder='Password'
          />

          <TextInput
            type='password'
            value={passwordRetype}
            onChange={setPasswordRetype}
            placeholder='Retype Password'
          />

          <ActionButton text='Create Account' onClick={handleSubmit} />
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
