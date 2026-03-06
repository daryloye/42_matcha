import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Register } from '../../api/auth';

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center gap-3 px-24 py-12 bg-white/75 backdrop-blur-md rounded-3xl border-2'>
        <h1>Welcome to Matcha</h1>

        <form
          className='flex flex-col items-center gap-1 pt-6'
          onSubmit={handleSubmit}
        >
          <input
            className='w-full'
            type='text'
            value={formData.firstname}
            onChange={(e) => handleChange('firstname', e.target.value.trim())}
            placeholder='First name'
            required
          />

          <input
            className='w-full'
            type='text'
            value={formData.lastname}
            onChange={(e) => handleChange('lastname', e.target.value.trim())}
            placeholder='Last name'
            required
          />

          <input
            className='w-full'
            type='email'
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value.trim())}
            placeholder='Email'
            required
          />

          <input
            className='w-full'
            type='text'
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value.trim())}
            placeholder='Username'
            required
          />

          <input
            className='w-full'
            type='password'
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value.trim())}
            placeholder='Password'
            required
          />

          <input
            className='w-full'
            type='password'
            value={formData.passwordRetype}
            onChange={(e) =>
              handleChange('passwordRetype', e.target.value.trim())
            }
            placeholder='Retype Password'
            required
          />

          <button type='submit' className='submit-button'>
            Create Account
          </button>
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
