import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Login } from '../../api/auth';
import { ActionButton } from '../../components/ActionButton';
import { TextInput } from '../../components/TextInput';
import './auth.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.username === '' || formData.password === '') {
      toast.error('Please enter username and password');
      return;
    }

    try {
      await Login(formData);
      toast('🚀 Welcome to Matcha');
      navigate('/search');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className='page-wrapper'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <form>
          <TextInput
            type='text'
            value={formData.username}
            onChange={(value) => handleChange('username', value)}
            placeholder='Username'
          />

          <TextInput
            type='password'
            value={formData.password}
            onChange={(value) => handleChange('password', value)}
            placeholder='Password'
          />

          <ActionButton text='Login' onClick={handleSubmit} />
        </form>

        <Link to='/signup'>Create Account</Link>
        <Link to='/forgotpassword'>I forgot my password</Link>
      </div>
    </div>
  );
}
