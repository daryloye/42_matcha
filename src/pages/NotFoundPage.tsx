import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className='page-wrapper-center' style={{ flexDirection: 'column' }}>
      <h1>Page Not Found</h1>
      <Link to='/'>
        <button type='button'>Back to Home</button>
      </Link>
    </div>
  );
}
