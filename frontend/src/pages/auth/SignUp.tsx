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
import { Register } from '../../api/auth';

const { StringType } = Schema.Types;
const model = Schema.Model({
  firstname: StringType().isRequired('First name is required'),
  lastname: StringType().isRequired('Last name is required'),
  email: StringType()
    .isEmail('Please enter a vaild email')
    .isRequired('Email is required'),
  username: StringType().isRequired('Username is required'),
  password: StringType().isRequired('Password is required'),
  confirmPassword: StringType()
    .isRequired('Please retype password')
    .addRule((value, data) => value === data.password, 'Passwords must match'),
});

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const toaster = useToaster();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await Register({
        first_name: formValue.firstname,
        last_name: formValue.lastname,
        email: formValue.email,
        username: formValue.username,
        password: formValue.password,
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
              firstname: value.firstname.trim(),
              lastname: value.lastname.trim(),
              email: value.email.trim(),
              username: value.username.trim(),
              password: value.password.trim(),
              confirmPassword: value.confirmPassword.trim(),
            })
          }
          onSubmit={handleSubmit}
          className='flex flex-col items-center pt-6'
        >
          <Form.Stack spacing={5}>
            <Form.Control name='firstname' placeholder='First name' />
            <Form.Control name='lastname' placeholder='Last name' />
            <Form.Control name='email' placeholder='Email' />
            <Form.Control name='username' placeholder='Username' />
            <Form.Control
              name='password'
              accepter={PasswordInput}
              placeholder='Password'
            />
            <Form.Control
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
                Create Account
              </Button>
            </Form.Group>
          </Form.Stack>
        </Form>

        <Link to='/'>Back to Login</Link>
      </div>
    </div>
  );
}
