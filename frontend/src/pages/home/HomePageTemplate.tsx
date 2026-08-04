import HeartIcon from '@rsuite/icons/Heart';
import NoticeIcon from '@rsuite/icons/Notice';
import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Badge,
  HStack,
  IconButton,
  Message,
  Notification,
  Popover,
  Tag,
  useToaster,
  VStack,
  Whisper,
} from 'rsuite';
import { GetBasicProfile } from '../../api/profile';
import type { AppNotification, BasicProfile } from '../../utils/types';
import { Logout } from '../../api/auth';
import { getPictureSrc } from '../../utils/utils';
import { GetNotifications, MarkNotificationsRead } from '../../api/notification';
import { connectSocket, disconnectSocket } from '../../api/socket';

export function HomePageTemplate({ page }
  : { page: ReactNode | ((helpers: { refreshBasicProfile: () => Promise<void> }) => ReactNode) }) {
  const [basicProfile, setBasicProfile] = useState<BasicProfile | null>(null);
  const toaster = useToaster();
  
  const fetchBasicProfile = async () => {
    try {
      const res = await GetBasicProfile();
      setBasicProfile(res.profile);
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  }

  // Get user profile
  useEffect(() => {
    fetchBasicProfile();

    const interval = setInterval(fetchBasicProfile, 10000);
    return () => clearInterval(interval);
  }, []);

  // A successful basicProfile fetch means the httpOnly access_token cookie is
  // valid, so it's safe to open the socket. connectSocket() is a no-op if a
  // connection already exists (e.g. navigating between pages).
  useEffect(() => {
    if (!basicProfile) return;
    connectSocket();
  }, [basicProfile]);

  if (!basicProfile) return null;

  return (
    <div className='h-screen flex flex-col px-12 pt-8 pb-4'>
      <div className='flex-1 min-h-0'>
        <div className='flex h-full flex-col py-8 md:flex-row bg-white/75 backdrop-blur-md rounded-3xl border-3 overflow-hidden'>
          <div className='w-full md:w-[25%] md:min-w-[220px] md:max-w-[320px] shrink-0 px-8 overflow-y-scroll'>
            <Sidebar profile={basicProfile} />
          </div>

          <main className='flex-1 min-w-0 px-8 border-l-4 overflow-y-scroll hidden md:block'>
            {typeof page === 'function'
              ? page({ refreshBasicProfile: fetchBasicProfile })
              : page
            }
          </main>
        </div>
      </div>

      <footer className='text-center text-sm pt-2 italic'>@ 42-matcha-2026</footer>
    </div>
  );
}

const NOTIFICATION_LABELS: Record<AppNotification['type'], string> = {
  like: 'Someone liked your profile.',
  match: "It's a match!",
  view: 'Someone viewed your profile.',
  unlike: 'A connection unliked you.',
};

function Sidebar({ profile }: { profile: BasicProfile }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const toaster = useToaster();

  // Load notification history once on mount.
  useEffect(() => {
    GetNotifications()
      .then((res) => setNotifications(res.notifications))
      .catch(() => {});
  }, []);

  // Live push: the server emits `notification` to this user's personal room
  // (see match.controller.ts) any time someone likes/views/matches/unlikes them.
  useEffect(() => {
    const socket = connectSocket();

    const handleNotification = (payload: { type: AppNotification['type']; fromId: string }) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          user_id: '',
          from_user_id: payload.fromId,
          type: payload.type,
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      toaster.push(
        <Notification type='info' closable>
          {NOTIFICATION_LABELS[payload.type]}
        </Notification>,
      );
    };

    socket.on('notification', handleNotification);
    return () => {
      socket.off('notification', handleNotification);
    };
  }, [toaster]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleOpen = () => {
    if (unreadCount === 0) return;
    MarkNotificationsRead()
      .then(() => setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true }))))
      .catch(() => {});
  };

  const handleMessageClose = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const speaker = (
    <Popover title='Notifications' className='max-h-128 w-64 overflow-y-scroll'>
      {notifications.length > 0 ? (
        notifications.map((n) => (
          <Message
            closable
            key={n.id}
            onClose={() => handleMessageClose(n.id)}
          >
            {NOTIFICATION_LABELS[n.type]}
          </Message>
        ))
      ) : (
        <div>
          <p>You have no notifications.</p>
          <p>Go touch some grass.</p>
        </div>
      )}
    </Popover>
  );

  return (
    <div className='home-sidebar flex flex-col gap-4'>
      <HStack spacing={15}>
        <Avatar src={getPictureSrc(profile.picture)} size='xl' circle />

        <Tag color='red' size='lg'>
          <HeartIcon /> {profile.fame_rating}
        </Tag>

        <Whisper placement='rightStart' trigger='click' speaker={speaker} onOpen={handleOpen}>
          <Badge
            content={unreadCount}
            className={unreadCount > 0 ? 'animate-bounce' : ''}
          >
            <IconButton
              icon={<NoticeIcon />}
              appearance='subtle'
              circle
              size='lg'
              className='notification-btn'
            />
          </Badge>
        </Whisper>
      </HStack>

      <p className='text-xl font-bold truncate'>
        Welcome {profile.first_name}!
      </p>

      <NavigationLinks />
    </div>
  );
}

function NavigationLinks() {
  return (
    <VStack spacing={20}>
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

      <Link to='/' onClick={async () => { disconnectSocket(); await Logout() }}>
        <h1>Logout</h1>
      </Link>
    </VStack>
  );
}
