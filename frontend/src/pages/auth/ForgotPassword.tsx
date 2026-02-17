import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ForgotPassword } from '../../api/auth';
import { ActionButton } from '../../components/ActionButton';
import { TextInput } from '../../components/TextInput';
import './auth.css';

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

  const handleSubmit = async () => {
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
    <div className='page-wrapper'>
      <div className='page-container login-container'>
        <h1>Welcome to Matcha</h1>

        <form>
          <TextInput
            type='email'
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            placeholder='Your email'
          />

          <ActionButton text='Request Reset Link' onClick={handleSubmit} />
        </form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
