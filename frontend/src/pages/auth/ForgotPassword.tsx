import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ForgotPassword } from '../../api/auth';

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: '',
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

    if (formData.email === '') {
      toast.error('Please enter your email');
    }

    try {
      const res = await ForgotPassword(formData);
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
            type='email'
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value.trim())}
            placeholder='Your email'
            required
          />

          <button type='submit' className='submit-button'>
            Request Reset Link
          </button>
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
