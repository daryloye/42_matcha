import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import profilePic from '../../assets/profilePic2.png';

export function HomePageTemplate({ page }: { page: ReactNode }) {
  return (
    <div className='h-screen flex flex-col px-12 pt-8 pb-4'>
      <div className='flex-1 min-h-0'>
        <div className='flex h-full flex-col py-8 md:flex-row bg-white/75 backdrop-blur-md rounded-3xl border-3 overflow-hidden'>
          <div className='w-full md:w-[25%] md:min-w-[220px] md:max-w-[320px] shrink-0 px-8 overflow-y-auto'>
            <Sidebar />
          </div>

          <div className='flex-1 min-w-0 px-8 border-l-4 overflow-y-auto hidden md:block'>
            {page}
          </div>
        </div>
      </div>

      <p className='text-center text-sm pt-2 italic'>@ 42-matcha-2026</p>
    </div>
  );
}

function Sidebar() {
  return (
    <div className='home-sidebar flex flex-col gap-4'>
      <img src={profilePic} className='h-32 w-32 rounded-full' />

      <h2 className='text-center text-base truncate'>
        Your nameYour nameYour nameYour nameYour nameYour nameYour nameYour
        nameYour nameYour name
      </h2>

      <Link to='/search'>
        <h1>Search</h1>
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
