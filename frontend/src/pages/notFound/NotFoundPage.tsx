import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <h1>Page Not Found</h1>
      <br />
      <button
        type='button'
        className='submit-button'
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
}
