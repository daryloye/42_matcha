import CalendarIcon from '@rsuite/icons/Calendar';
import HeartIcon from '@rsuite/icons/Heart';
import LocationIcon from '@rsuite/icons/Location';
import TagIcon from '@rsuite/icons/Tag';
import { useEffect, useState } from 'react';
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
import { GetMatchStatus, UpdateMatchStatus } from '../../api/match';
import type { MatchStatus } from '../../utils/types';

export default function Users() {
  return <HomePageTemplate page={<UsersPage />} />;
}

function UsersPage() {
  const [matchStatus, setMatchStatus] = useState<MatchStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const toaster = useToaster();
  const navigate = useNavigate();
  
  // const { id } = useParams();
  const targetId = "450d84f8-c8ae-4842-a87d-b9a0839ab2a8";

  const fetchMatchStatus = async () => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const res = await GetMatchStatus(token, targetId);
      setMatchStatus(res);
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  }

  const handleUpdateStatus = async (action: string) => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    if (action === 'report') {
      toaster.push(
        <Notification type='info' closable>
          Reported {profile.name}
        </Notification>,
      );
    }

    try {
      await UpdateMatchStatus(token, {action: action, targetId: targetId});
      await fetchMatchStatus();
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

  useEffect(() => { fetchMatchStatus() }, []);
  
  if (!matchStatus) return null;

  if (matchStatus.isBlockedByTarget) {
    return (
      <VStack>
      <h1>{profile.name}</h1>
      <p className='mt-5'>You have been blocked by this user</p>
      </VStack>
    )
  }
  return (
    <div>
      <UserProfileHeader matchStatus={matchStatus}/>

      <div className='flex flex-col mt-5 gap-4'>
        <UserProfileBody />

        <UserProfileMatchButtons matchStatus={matchStatus} loading={loading} handleChat={handleChat} handleUpdateStatus={handleUpdateStatus} />
      </div>
    </div>
  );
}

function UserProfileHeader({matchStatus}: {matchStatus: MatchStatus}) {
  return (
    <VStack>
      <h1>{profile.name}</h1>
      <HStack>
        <Badge compact size='lg' color={profile.online ? 'green' : 'red'} />
        <p>Online {profile.online ? '' : profile.lastSeen}</p>
      </HStack>
      {matchStatus.isConnected ? (
        <HStack>
          <Badge
            compact
            size='lg'
            color='green'
            content={<MdCheck size={12} />}
          />
          <p>Connected</p>
        </HStack>
      ) : (
        <HStack>
          <Badge
            compact
            size='lg'
            color='red'
            content={<MdClose size={12} />}
          />
          <p>Not connected</p>
        </HStack>
      )}
    </VStack>
  );
}

function UserProfileBody() {
  return (
    <>
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
    </>
  );
}

function UserProfileMatchButtons({
  matchStatus,
  loading,
  handleChat,
  handleUpdateStatus,
}: {
  matchStatus: MatchStatus,
  loading: boolean,
  handleChat: any,
  handleUpdateStatus: any
}) {
  return (
    <>
      <VStack className='mt-5 w-full max-w-xs'>
        <div className='flex flex-col gap-3 w-full'>
          {/* Like / Unlike */}
          <Button
            type='button'
            appearance={matchStatus.hasLikedTarget ? 'ghost' : 'primary'}
            size='lg'
            color='blue'
            className='w-full rounded-2xl font-semibold transition'
            loading={loading}
            disabled={matchStatus.isBlockingTarget}
            onClick={() => {
              matchStatus.hasLikedTarget
                ? handleUpdateStatus('unlike')
                : handleUpdateStatus('like');
            }}
          >
            <HeartIcon />{' '}
            <span className='ml-2'>
              {matchStatus.hasLikedTarget ? 'Unlike' : 'Like'}
            </span>
          </Button>

          {/* Chat */}
          <Button
            type='button'
            appearance='primary'
            size='lg'
            color='green'
            className='w-full rounded-2xl font-semibold transition'
            loading={loading}
            disabled={!matchStatus.isConnected || matchStatus.isBlockingTarget}
            onClick={handleChat}
          >
            <IoChatbubbleEllipses />
            <span className='ml-2'>Chat</span>
          </Button>

          {/* Block / Unblock */}
          <Button
            type='button'
            appearance={matchStatus.isBlockingTarget ? 'ghost' : 'primary'}
            size='lg'
            color='orange'
            className='w-full rounded-2xl font-semibold transition'
            loading={loading}
            onClick={() => {
              matchStatus.isBlockingTarget
                ? handleUpdateStatus('unblock')
                : (handleUpdateStatus('block'),
                  handleUpdateStatus('unlike'));
            }}
          >
            <MdBlock />
            <span className='ml-2'>
              {matchStatus.isBlockingTarget ? 'Unblock' : 'Block'}
            </span>
          </Button>

          {/* Report */}
          <Button
            type='button'
            appearance='primary'
            size='lg'
            color='red'
            className='w-full rounded-2xl font-semibold transition'
            loading={loading}
            onClick={() => handleUpdateStatus('report')}
          >
            <MdReport />
            <span className='ml-2'>Report</span>
          </Button>
        </div>
      </VStack>
    </>
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
