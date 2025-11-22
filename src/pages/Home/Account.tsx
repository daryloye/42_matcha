import { HomePageTemplate } from './HomePageTemplate';

export default function Account() {
  return (
    <HomePageTemplate page={<AccountPage />} />
  )
}

function AccountPage() {
  return (
    <div>
      <h1>Account</h1>
      <h2>Reset Password</h2>
    </div>
  )
}