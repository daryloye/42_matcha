import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ActionButton } from '../../../components/ActionButton';
import { TextInput } from '../../../components/TextInput';
import '../auth.css';

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
    <div className='page-wrapper'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <p className='error-message'>{errorMsg}</p>

        <form>
          <TextInput
            type='email'
            value={email}
            onChange={setEmail}
            placeholder='Your email'
          />

          <ActionButton text='Request Reset Link' onClick={handleSubmit} />
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
