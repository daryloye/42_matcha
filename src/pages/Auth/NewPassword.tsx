import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

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
          <input
            type='password'
            id='password'
            value={password}
            onChange={(event) => setPassword(event.target.value.trim())}
            placeholder='Enter new password'
            required
          />

          <input
            type='password'
            id='password-retype'
            value={passwordRetype}
            onChange={(event) => setPasswordRetype(event.target.value.trim())}
            placeholder='Retype password'
            required
          />

          <button type='button' onClick={handleSubmit}>
            Reset Password
          </button>
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
