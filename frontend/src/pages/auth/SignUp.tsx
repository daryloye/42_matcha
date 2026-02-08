import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (password === '') {
      toast.error('Please enter a password');
    } else if (password !== passwordRetype) {
      toast.error('Passwords do not match');
    }
    // Simulate /auth/signup request
    else if (password === 'a') {
      toast.error('Password is too weak');
    } else {
      toast.success('Welcome to Matcha 🥳');
      navigate('/dashboard');
    }
  };

  return (
    <div className='page-wrapper'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

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
