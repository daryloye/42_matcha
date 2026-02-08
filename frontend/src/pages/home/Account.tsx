import { HomePageTemplate } from '../../components/home/HomePageTemplate';

export default function Account() {
  return <HomePageTemplate page={<AccountPage />} />;
}

function AccountPage() {
  return (
    <div className='home-page-layout'>
      <h1>Account</h1>
      <h2>Reset Password</h2>
    </div>
  );
}
