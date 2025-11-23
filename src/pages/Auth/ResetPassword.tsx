import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (email === '') {
      setErrorMsg('Please enter your email');
    } else {
      setErrorMsg('');
      alert('Please check your email for the reset instructions.');
      navigate('/');
    }
  };

  return (
    <div className='page-wrapper-center'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <p className='error-message'>{errorMsg}</p>

        <form>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(event) => setEmail(event.target.value.trim())}
            placeholder='Your email'
            required
          />

          <button type='button' onClick={handleSubmit}>
            Request reset link
          </button>
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
