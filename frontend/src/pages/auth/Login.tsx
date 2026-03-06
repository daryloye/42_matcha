import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Login } from '../../api/auth';

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

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

          <button type='submit' className='submit-button'>
            Login
          </button>
        </form>

        <Link to='/signup'>Create Account</Link>
        <Link to='/forgotpassword'>I forgot my password</Link>
      </div>
    </div>
  );
}
