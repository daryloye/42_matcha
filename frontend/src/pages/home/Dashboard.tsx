import { HomePageTemplate } from '../../components/home/HomePageTemplate';

export default function Dashboard() {
  return <HomePageTemplate page={<DashboardPage />} />;
}

function DashboardPage() {
  return (
    <div className='home-page-layout'>
      <h1>Dashboard</h1>
    </div>
  );
}
