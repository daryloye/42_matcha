import { toast } from 'react-toastify';
import { ActionButton } from '../../components/ActionButton';
import { HomePageTemplate } from '../../components/home/HomePageTemplate';

export default function Account() {
  return <HomePageTemplate page={<AccountPage />} />;
}

function AccountPage() {
  const notify = () =>
    toast.success('🦄 Wow so easy!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  return (
    <div className='home-page-layout'>
      <h1>Account</h1>
      <h2>Reset Password</h2>
      <ActionButton text='click me' onClick={notify} />
    </div>
  );
}
