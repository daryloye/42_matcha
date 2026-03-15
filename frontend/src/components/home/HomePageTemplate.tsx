import { useAtom } from 'jotai';
import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GetBasicProfile } from '../../api/auth';
import profilePic from '../../assets/profilePic2.png';
import { basicProfileAtom } from '../../utils/atoms';
import './home.css';

export function HomePageTemplate({ page }: { page: ReactNode }) {
  const [basicProfile, setBasicProfile] = useAtom(basicProfileAtom);

  useEffect(() => {
    let isMounted = true;

    async function getBasicProfile() {
      try {
        const res = await GetBasicProfile();
        if (isMounted) setBasicProfile(res.userProfile);
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    getBasicProfile();
    return () => {
      isMounted = false;
    };
  }, [setBasicProfile]);

  console.log(basicProfile);

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
