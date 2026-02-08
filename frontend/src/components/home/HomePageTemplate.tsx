import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import profilePic from '../../assets/profilePic2.png';
import './home.css';

export function HomePageTemplate({ page }: { page: ReactNode }) {
  return (
    <div className='page-wrapper'>
      <div className='page-container home-container'>
        <Sidebar />
        {page}
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className='home-sidebar'>
      <img src={profilePic} className='profile-picture' />
      <h2>
        Your nameYour nameYour nameYour nameYour nameYour nameYour nameYour
        nameYour nameYour name
      </h2>

      <Link to='/dashboard'>
        <h1>Dashboard</h1>
      </Link>

      <Link to='/profile'>
        <h1>Profile</h1>
      </Link>

      <Link to='/chat'>
        <h1>Chat</h1>
      </Link>

      <Link to='/account'>
        <h1>Account</h1>
      </Link>

      <Link to='/'>
        <h1>Logout</h1>
      </Link>
    </div>
  );
}
