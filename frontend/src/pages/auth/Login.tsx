import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Notification,
  PasswordInput,
  Schema,
  useToaster,
} from 'rsuite';
import { Login } from '../../api/auth';
import { setToken } from '../../utils/token';

const { StringType } = Schema.Types;
const model = Schema.Model({
  username: StringType().isRequired('Username is required'),
  password: StringType().isRequired('Password is required'),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    username: '',
    password: '',
  });

  const toaster = useToaster();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await Login({
        username: formValue.username,
        password: formValue.password,
      });
      setToken(res.token);
      toaster.push(
        <Notification type='success' closable>
          Welcome to Matcha
        </Notification>,
      );
      navigate('/search');
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
              username: value.username.trim(),
              password: value.password.trim(),
            })
          }
          onSubmit={handleSubmit}
          className='flex flex-col items-center pt-6'
        >
          <Form.Stack spacing={5}>
            <Form.Control name='username' placeholder='Username' />
            <Form.Control
              name='password'
              accepter={PasswordInput}
              placeholder='Password'
            />

            <Form.Group className='my-4'>
              <Button
                type='submit'
                appearance='primary'
                loading={loading}
                block
              >
                Login
              </Button>
            </Form.Group>
          </Form.Stack>
        </Form>

        <Link to='/signup'>Create Account</Link>
        <Link to='/forgotpassword'>I forgot my password</Link>
      </div>
    </div>
  );
}
