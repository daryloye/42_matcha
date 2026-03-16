import CalendarIcon from '@rsuite/icons/Calendar';
import HeartIcon from '@rsuite/icons/Heart';
import LocationIcon from '@rsuite/icons/Location';
import TagIcon from '@rsuite/icons/Tag';
import { useState } from 'react';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import {
  MdBlock,
  MdCheck,
  MdClose,
  MdPersonOutline,
  MdReport,
} from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  HStack,
  Image,
  Notification,
  Tag,
  TagGroup,
  useToaster,
  VStack,
} from 'rsuite';
import profilePic from '../../assets/profilePic2.png';
import { getToken } from '../../utils/token';
import { HomePageTemplate } from './HomePageTemplate';

export default function Users() {
  return <HomePageTemplate page={<UsersPage />} />;
}

function UsersPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [like, setLike] = useState(false);
  const [connected, setConnected] = useState(false);
  const [block, setBlock] = useState(false);

  const toaster = useToaster();
  const navigate = useNavigate();

  const handleLike = async () => {
    setLoading(true);
    const token = getToken();

    if (!token) {
      navigate('/');
      return;
    }

    try {
      toaster.push(
        <Notification type='info' closable>
          {like ? `Unliked ${profile.name}` : `Liked ${profile.name}`}
        </Notification>,
      );
      setLike(!like);
      setConnected(!connected);
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    setLoading(true);

    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    try {
      toaster.push(
        <Notification type='info' closable>
          Chat {profile.name}
        </Notification>,
      );
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    setLoading(true);

    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    try {
      toaster.push(
        <Notification type='info' closable>
          {block ? `Unblocked ${profile.name}` : `Blocked ${profile.name}`}
        </Notification>,
      );
      setBlock(!block);
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    setLoading(true);

    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    try {
      toaster.push(
        <Notification type='info' closable>
          Reported {profile.name}
        </Notification>,
      );
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <VStack>
        <h1>{profile.name}</h1>
        <HStack>
          <Badge compact size='lg' color={profile.online ? 'green' : 'red'} />
          <p>Online {profile.online ? '' : profile.lastSeen}</p>
        </HStack>
        <HStack>
          <Badge
            compact
            size='lg'
            color={profile.connected ? 'green' : 'red'}
            content={
              profile.connected ? <MdCheck size={12} /> : <MdClose size={12} />
            }
          />
          <p>{profile.connected ? 'Connected' : 'Not connected'}</p>
        </HStack>
      </VStack>

      <div className='flex flex-col mt-5 gap-4'>
        <Image rounded src={profile.image} alt='Shadow' width={300} />
        <HStack>
          <Tag color='green' size='lg' className='opacity-70'>
            <MdPersonOutline className='inline' /> {profile.gender}
          </Tag>
          <Tag color='violet' size='lg' className='opacity-70'>
            <CalendarIcon /> Age: {profile.age}
          </Tag>
          <Tag color='cyan' size='lg' className='opacity-80'>
            <LocationIcon /> {profile.distance} km away
          </Tag>
          <Tag color='red' size='lg'>
            <HeartIcon /> {profile.fame}
          </Tag>
        </HStack>

        <TagGroup className='flex flex-wrap w-full'>
          {profile.tags.map((t: string) => (
            <Tag key={t} color='pink' className='tag-ellipsis'>
              <TagIcon /> {t}
            </Tag>
          ))}
        </TagGroup>

        <VStack className='mt-5 w-full max-w-xs'>
          <div className='flex flex-col gap-3 w-full'>
            <Button
              type='button'
              appearance={like ? 'ghost' : 'primary'}
              size='lg'
              color='blue'
              className='w-full rounded-2xl font-semibold shadow-md hover:shadow-lg transition'
              loading={loading}
              onClick={handleLike}
            >
              <HeartIcon />{' '}
              <span className='ml-2'>{like ? 'Unlike' : 'Like'}</span>
            </Button>

            <Button
              type='button'
              appearance='primary'
              size='lg'
              color='green'
              className='w-full rounded-2xl font-semibold border border-green-500 hover:bg-green-50 transition'
              loading={loading}
              disabled={!connected}
              onClick={handleChat}
            >
              <IoChatbubbleEllipses />
              <span className='ml-2'>Chat</span>
            </Button>

            <Button
              type='button'
              appearance={block ? 'ghost' : 'primary'}
              size='lg'
              color='orange'
              className='w-full rounded-2xl font-semibold border border-red-400 hover:bg-red-50 transition'
              loading={loading}
              onClick={handleBlock}
            >
              <MdBlock />
              <span className='ml-2'>{block ? 'Unblock' : 'Block'}</span>
            </Button>

            <Button
              type='button'
              appearance='primary'
              size='lg'
              color='red'
              className='w-full rounded-2xl font-semibold border border-red-400 hover:bg-red-50 transition'
              loading={loading}
              onClick={handleReport}
            >
              <MdReport />
              <span className='ml-2'>Report</span>
            </Button>
          </div>
        </VStack>
      </div>
    </div>
  );
}

const profile = {
  id: 1,
  name: 'very-very-very-very-long-name',
  gender: 'Female',
  image: profilePic,
  age: 25,
  fame: 1,
  distance: 10.1,
  tags: [
    'car',
    'animals',
    'very-very-long-words',
    'dogs',
    'very-very-longer-longer- longer-words',
  ],
  like: true,
  chat: false,
  report: true,
  connected: false,
  online: false,
  lastSeen: '2 hours ago',
};
