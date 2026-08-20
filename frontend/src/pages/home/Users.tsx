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
import { useParams } from 'react-router-dom';
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
import { GetMatchStatus, UpdateMatchStatus } from '../../api/match';
import { GetUserProfile } from '../../api/search';
import {
  MatchStatusEnum,
  type MatchStatus,
  type PictureData,
  type SearchUserProfile,
} from '../../utils/types';
import { getPictureSrc } from '../../utils/utils';
import { HomePageTemplate } from './HomePageTemplate';

export default function Users() {
  return <HomePageTemplate page={<UsersPage />} />;
}

function UsersPage() {
  const [profile, setProfile] = useState<SearchUserProfile | null>(null);
  const [matchStatus, setMatchStatus] = useState<MatchStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const toaster = useToaster();

  const { id } = useParams();
  if (!id) return null;

  const fetchProfile = async () => {
    try {
      await UpdateMatchStatus({ action: MatchStatusEnum.VIEW, targetId: id });
      const res = await GetUserProfile(id);
      setProfile(res.profile);
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  };

  const fetchMatchStatus = async () => {
    try {
      const res = await GetMatchStatus(id);
      setMatchStatus(res);
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMatchStatus();
  }, []);

  if (!profile || !matchStatus) return null;

  const handleUpdateStatus = async (action: string) => {
    setLoading(true);

    if (action === MatchStatusEnum.REPORT) {
      toaster.push(
        <Notification type='info' closable>
          Reported {profile.first_name} {profile.last_name}
        </Notification>,
      );
    }

    try {
      await UpdateMatchStatus({ action: action, targetId: id });
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

    try {
      toaster.push(
        <Notification type='info' closable>
          Chat {profile.first_name}
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

  if (matchStatus.isBlockedByTarget) {
    return (
      <VStack>
        <header>
          {profile.first_name} {profile.last_name}
        </header>
        <p className='mt-5'>You have been blocked by this user</p>
      </VStack>
    );
  }
  return (
    <div>
      <UserProfileHeader profile={profile} matchStatus={matchStatus} />

      <div className='flex flex-col mt-5 gap-4'>
        <UserProfileBody profile={profile} />

        <UserProfileMatchButtons
          matchStatus={matchStatus}
          loading={loading}
          handleChat={handleChat}
          handleUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
}

function UserProfileHeader({
  profile,
  matchStatus,
}: {
  profile: SearchUserProfile;
  matchStatus: MatchStatus;
}) {
  return (
    <VStack>
      <header>
        {profile.first_name} {profile.last_name}
      </header>
      <HStack>
        <Badge compact size='lg' color={profile.online ? 'green' : 'red'} />
        <p>
          {profile.online
            ? 'Online'
            : `Last seen ${new Date(profile.last_seen).toLocaleString('en-GB')}`}
        </p>
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

function UserProfileBody({ profile }: { profile: SearchUserProfile }) {
  return (
    <>
      <Image
        rounded
        src={
          getPictureSrc(profile.profile_picture[0]?.image_url) ??
          import.meta.env.VITE_PLACEHOLDER_IMAGE
        }
        width={300}
        height={300}
      />
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
          <HeartIcon /> {profile.fame_rating}
        </Tag>
      </HStack>

      <TagGroup className='flex flex-wrap w-full'>
        {(profile.interests ?? [])
          .filter((t: any) => t)
          .map((t: string) => (
            <Tag key={t} color='pink' className='tag-ellipsis'>
              <TagIcon /> {t}
            </Tag>
          ))}
      </TagGroup>

      <VStack>
        <br />
        <p className='text-lg font-bold'>Biography:</p>
        <p className='whitespace-pre-line'>{profile.biography}</p>
        <br />
        {profile.pictures.length > 0 && (
          <p className='text-lg font-bold'>Pictures:</p>
        )}
        <HStack>
          {(profile.pictures ?? []).map((pic: PictureData) => (
            <Image
              key={pic.id}
              rounded
              src={getPictureSrc(pic.image_url)}
              width={200}
              height={200}
            />
          ))}
        </HStack>
      </VStack>
    </>
  );
}

function UserProfileMatchButtons({
  matchStatus,
  loading,
  handleChat,
  handleUpdateStatus,
}: {
  matchStatus: MatchStatus;
  loading: boolean;
  handleChat: any;
  handleUpdateStatus: any;
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
                ? handleUpdateStatus(MatchStatusEnum.UNLIKE)
                : handleUpdateStatus(MatchStatusEnum.LIKE);
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
                ? handleUpdateStatus(MatchStatusEnum.UNBLOCK)
                : handleUpdateStatus(MatchStatusEnum.BLOCK);
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
            onClick={() => handleUpdateStatus(MatchStatusEnum.REPORT)}
          >
            <MdReport />
            <span className='ml-2'>Report</span>
          </Button>
        </div>
      </VStack>
    </>
  );
}
