import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ActionButton } from '../../components/ActionButton';
import { TextInput } from '../../components/TextInput';
import './auth.css';

export default function NewPassword() {
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
    if (password === '') {
      setErrorMsg('Please enter a password');
    } else {
      setErrorMsg('');
      alert('Password reset successful.');
      navigate('/');
    }
  };

  return (
    <div className='page-wrapper'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <p className='error-message'>{errorMsg}</p>

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
