import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Form,
  Notification,
  PasswordInput,
  Schema,
  useToaster,
} from 'rsuite';
import { ResetPassword } from '../../api/auth';
import { FormField } from '../../components/FormField';

const { StringType } = Schema.Types;
const model = Schema.Model({
  password: StringType().isRequired('Password is required'),
  confirmPassword: StringType()
    .isRequired('Please retype password')
    .addRule((value, data) => value === data.password, 'Passwords must match'),
});

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    password: '',
    confirmPassword: '',
  });

  const toaster = useToaster();
  const navigate = useNavigate();

  // Get reset password token from search parameters
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  if (!token) {
    toaster.push(
      <Notification type='error' closable>
        Invalid token
      </Notification>,
    );
    navigate('/');
    return;
  }

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await ResetPassword({
        password: formValue.password,
        token: token,
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
              password: value.password.trim(),
              confirmPassword: value.confirmPassword.trim(),
            })
          }
          onSubmit={handleSubmit}
          className='flex flex-col items-center pt-6'
        >
          <Form.Stack spacing={5}>
            <FormField
              name='password'
              accepter={PasswordInput}
              placeholder='Password'
            />
            <FormField
              name='confirmPassword'
              accepter={PasswordInput}
              placeholder='Confirm Password'
            />

            <Form.Group className='my-4'>
              <Button
                type='submit'
                appearance='primary'
                loading={loading}
                block
              >
                Reset Password
              </Button>
            </Form.Group>
          </Form.Stack>
        </Form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
