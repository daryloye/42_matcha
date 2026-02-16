import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Verify } from '../../api/api';

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get('token');
    if (!token) {
      toast.error('Invalid verification link');
      navigate('/');
      return;
    }

    async function verify() {
      try {
        const res = await Verify(token);
        toast.info(res.message);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        navigate('/');
      }
    }

    verify();
  }, [searchParams, navigate]);

  return null;
}
