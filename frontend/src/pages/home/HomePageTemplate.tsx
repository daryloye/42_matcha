import HeartIcon from '@rsuite/icons/Heart';
import NoticeIcon from '@rsuite/icons/Notice';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Badge,
  HStack,
  IconButton,
  Message,
  Popover,
  Tag,
  VStack,
  Whisper,
} from 'rsuite';
import profilePic from '../../assets/profilePic2.png';

export function HomePageTemplate({ page }: { page: ReactNode }) {
  return (
    <div className='h-screen flex flex-col px-12 pt-8 pb-4'>
      <div className='flex-1 min-h-0'>
        <div className='flex h-full flex-col py-8 md:flex-row bg-white/75 backdrop-blur-md rounded-3xl border-3 overflow-hidden'>
          <div className='w-full md:w-[25%] md:min-w-[220px] md:max-w-[320px] shrink-0 px-8 overflow-y-scroll'>
            <Sidebar />
          </div>

          <div className='flex-1 min-w-0 px-8 border-l-4 overflow-y-scroll hidden md:block'>
            {page}
          </div>
        </div>
      </div>

      <p className='text-center text-sm pt-2 italic'>@ 42-matcha-2026</p>
    </div>
  );
}

function Sidebar() {
  const [messages, setMessages] = useState([
    { key: 1, value: 'You have a new follower.' },
    { key: 2, value: 'User1 wants to chat.' },
    { key: 3, value: 'User1 wants to chat.' },
    { key: 4, value: 'You have a new follower.' },
    { key: 5, value: 'You have a new follower.' },
    { key: 6, value: 'You have a new follower.' },
    { key: 7, value: 'You have a new follower.' },
    { key: 8, value: 'You have a new follower.' },
    { key: 9, value: 'You have a new follower.' },
    { key: 10, value: 'You have a new follower.' },
  ]);

  const handleMessageClose = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.key !== id));
  };

  const speaker = (
    <Popover title='Notifications' className='max-h-128 w-64 overflow-y-scroll'>
      {messages.length > 0 ? (
        messages.map((m) => (
          <Message
            closable
            key={m.key}
            onClose={() => handleMessageClose(m.key)}
          >
            {m.value}
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
        <Avatar src={profilePic} size='xl' circle />

        <Tag color='red' size='lg'>
          <HeartIcon /> 3
        </Tag>

        <Whisper placement='rightStart' trigger='click' speaker={speaker}>
          <Badge
            content={messages.length}
            className={messages.length > 0 ? 'animate-bounce' : ''}
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

      <p className='text-center text-xl font-bold truncate'>
        Your nameYour nameYour nameYour nameYour nameYour nameYour nameYour
        nameYour nameYour name
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

      <Link to='/'>
        <h1>Logout</h1>
      </Link>
    </VStack>
  );
}
