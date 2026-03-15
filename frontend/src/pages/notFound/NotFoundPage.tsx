import { useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <h1>Page Not Found</h1>
      <br />
      <Button type='submit' appearance='primary' onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
}
