import { Link, useNavigate } from 'react-router-dom';
import { ActionButton } from '../../components/ActionButton';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='page-wrapper col'>
      <h1>Page Not Found</h1>
      <br />
      <Link to='/'>
        <ActionButton text='Back to Home' onClick={() => navigate('/')} />
      </Link>
    </div>
  );
}
