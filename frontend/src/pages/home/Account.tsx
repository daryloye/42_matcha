import { List, VStack, useToaster, Notification } from 'rsuite';
import { HomePageTemplate } from './HomePageTemplate';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/token';
import { GetAccountData } from '../../api/match';
import type { AccountData } from '../../utils/types';

export default function Account() {
  return <HomePageTemplate page={<AccountPage />} />;
}

function AccountPage() {
  const [views, setViews] = useState<AccountData[] | null>(null);
  const [likes, setLikes] = useState<AccountData[] | null>(null);
  const toaster = useToaster();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    async function fetchAccountData() {
      try {
        const res = await GetAccountData(token!);
        setViews(res.views || []);
        setLikes(res.likes || []);

      } catch (err: any) {
        toaster.push(
          <Notification type='error' closable>
            {err.message}
          </Notification>,
        );
      }
    }

    fetchAccountData();
  }, []);

  if (!views || !likes) return null;

  return (
    <div>
      <h1>Account</h1>

      <div className='flex flex-col mt-5 gap-12'>
        <VStack>
          <p className='text-lg font-bold'>Your profile was viewed by:</p>
          <List className='rounded-lg'>
            {views && views.map((v: AccountData) => (
              <List.Item key={v.user_id} className='w-100 text-center'>
                {v.first_name} {v.last_name}
              </List.Item>
            ))}
          </List>
        </VStack>

        <VStack>
          <p className='text-lg font-bold'>Your profile was liked by:</p>
          <List className='rounded-lg'>
            {likes && likes.map((v: AccountData) => (
              <List.Item key={v.user_id} className='w-100 text-center'>
                {v.first_name} {v.last_name}
              </List.Item>
            ))}
          </List>
        </VStack>
      </div>
    </div>
  );
}
