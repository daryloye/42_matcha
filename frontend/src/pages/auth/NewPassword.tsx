import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ActionButton } from '../../components/ActionButton';
import { TextInput } from '../../components/TextInput';
import './auth.css';

export default function NewPassword() {
  const [password, setPassword] = useState('');
  const [passwordRetype, setPasswordRetype] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (password === '') {
      toast.error('Please enter a password');
    } else if (password !== passwordRetype) {
      toast.error('Passwords do not match');
    } else {
      toast.success('Password reset successful.');
      navigate('/');
    }
  };

  return (
    <div className='page-wrapper'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <form>
          <TextInput
            type='password'
            value={password}
            onChange={setPassword}
            placeholder='Enter new password'
          />

          <TextInput
            type='password'
            value={passwordRetype}
            onChange={setPasswordRetype}
            placeholder='Retype password'
          />

          <ActionButton text='Reset Password' onClick={handleSubmit} />
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
