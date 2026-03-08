import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Notification, Schema, useToaster } from 'rsuite';
import { ForgotPassword } from '../../api/auth';

const { StringType } = Schema.Types;
const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a vaild email')
    .isRequired('Email is required'),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    email: '',
  });

  const toaster = useToaster();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await ForgotPassword({
        email: formValue.email,
      });
      toaster.push(
        <Notification type='info' closable>
          {res.message}
        </Notification>,
      );
      navigate('/');
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center gap-3 px-24 py-12 bg-white/75 backdrop-blur-md rounded-3xl border-2'>
        <h1>Welcome to Matcha</h1>

        <Form
          fluid
          formValue={formValue}
          model={model}
          onChange={(value) =>
            setFormValue({
              email: value.email.trim(),
            })
          }
          onSubmit={handleSubmit}
          className='flex flex-col items-center pt-6'
        >
          <Form.Stack spacing={5}>
            <Form.Control name='email' placeholder='Your email' />

            <Form.Group className='my-4'>
              <Button
                type='submit'
                appearance='primary'
                loading={loading}
                block
              >
                Request Reset Link
              </Button>
            </Form.Group>
          </Form.Stack>
        </Form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
