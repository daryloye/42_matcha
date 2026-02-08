import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ActionButton } from '../../components/ActionButton';
import { TextInput } from '../../components/TextInput';
import './auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (username === '' || password === '') {
      toast.error('Please enter email and password');
    }

    // simulate /auth/login request
    else if (username === 'a' && password === 'a') {
      toast.error('Incorrect email or password');
    } else {
      navigate('/search');
    }
  };

  return (
    <div className='page-wrapper'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <form>
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

          <ActionButton text='Login' onClick={handleSubmit} />
        </form>

        <Link to='/signup'>Create Account</Link>
        <Link to='/resetpassword'>I forgot my password</Link>
      </div>
    </div>
  );
}
