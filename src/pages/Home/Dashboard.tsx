import { HomePageTemplate } from './HomePageTemplate';

export default function Dashboard() {
  return <HomePageTemplate page={<DashboardPage />} />;
}

function DashboardPage() {
  return (
    <div className='home-page-container'>
      <h1>Dashboard</h1>
    </div>
  );
}
