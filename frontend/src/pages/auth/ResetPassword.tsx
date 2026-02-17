import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ResetPassword } from '../../api/auth';
import { ActionButton } from '../../components/ActionButton';
import { TextInput } from '../../components/TextInput';
import './auth.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
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
    <div className='page-wrapper'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <form>
          <TextInput
            type='password'
            value={formData.password}
            onChange={(value) => handleChange('password', value)}
            placeholder='Enter new password'
          />

          <TextInput
            type='password'
            value={formData.passwordRetype}
            onChange={(value) => handleChange('passwordRetype', value)}
            placeholder='Retype password'
          />

          <ActionButton text='Reset Password' onClick={handleSubmit} />
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
