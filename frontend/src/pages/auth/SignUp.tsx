import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Register } from '../../api/auth';
import { ActionButton } from '../../components/ActionButton';
import { TextInput } from '../../components/TextInput';
import './auth.css';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    passwordRetype: '',
  });
  const navigate = useNavigate();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      formData.firstname === '' ||
      formData.lastname === '' ||
      formData.email === '' ||
      formData.username === '' ||
      formData.password === '' ||
      formData.passwordRetype === ''
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.passwordRetype) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await Register(formData);
      toast.info(res.message);
      navigate('/');
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
            value={formData.firstname}
            onChange={(value) => handleChange('firstname', value)}
            placeholder='First name'
          />

          <TextInput
            type='text'
            value={formData.lastname}
            onChange={(value) => handleChange('lastname', value)}
            placeholder='Last name'
          />

          <TextInput
            type='email'
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            placeholder='Email'
          />

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

          <TextInput
            type='password'
            value={formData.passwordRetype}
            onChange={(value) => handleChange('passwordRetype', value)}
            placeholder='Retype Password'
          />

          <ActionButton text='Create Account' onClick={handleSubmit} />
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
