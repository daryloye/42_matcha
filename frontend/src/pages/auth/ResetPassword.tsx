import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ResetPassword } from '../../api/auth';

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  // Get reset password token from search parameters
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  if (!token) {
    toast.error('Invalid token');
    navigate('/');
    return;
  }

  const [formData, setFormData] = useState({
    password: '',
    passwordRetype: '',
    token: token,
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password === '') {
      toast.error('Please enter a password');
      return;
    }

    if (formData.password !== formData.passwordRetype) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await ResetPassword(formData);
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
            type='password'
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value.trim())}
            placeholder='Enter new password'
            required
          />

          <input
            className='w-full'
            type='password'
            value={formData.passwordRetype}
            onChange={(e) =>
              handleChange('passwordRetype', e.target.value.trim())
            }
            placeholder='Retype password'
            required
          />

          <button type='submit' className='submit-button'>
            Reset Password
          </button>
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
