import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Notification, useToaster } from 'rsuite';
import { Verify } from '../../api/auth';

// Verifies the user's registration and redirects to Home page
export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const toaster = useToaster();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get('token');
    if (!token) {
      toaster.push(
        <Notification type='error' closable>
          Invalid verification link
        </Notification>,
      );
      navigate('/');
      return;
    }

    async function verify(token: string) {
      try {
        const res = await Verify(token);
        toaster.push(
          <Notification type='info' closable>
            {res.message}
          </Notification>,
        );
      } catch (err: any) {
        toaster.push(
          <Notification type='error' closable>
            {err.message}
          </Notification>,
        );
      } finally {
        navigate('/');
      }
    }

    verify(token);
  }, [searchParams, navigate]);

  return null;
}
