import { List, VStack } from 'rsuite';
import { HomePageTemplate } from './HomePageTemplate';

export default function Account() {
  return <HomePageTemplate page={<AccountPage />} />;
}

function AccountPage() {
  return (
    <div>
      <h1>Account</h1>

      <div className='flex flex-col mt-5 gap-12'>
        <VStack>
          <p className='text-lg font-bold'>Your profile was viewed by:</p>
          <List className='rounded-lg'>
            {viewedByData.map((v, i) => (
              <List.Item key={i} className='w-100 text-center'>
                {v.username}
              </List.Item>
            ))}
          </List>
        </VStack>

        <VStack>
          <p className='text-lg font-bold'>Your profile was liked by:</p>
          <List className='rounded-lg'>
            {viewedByData.map((v, i) => (
              <List.Item key={i} className='w-100 text-center'>
                {v.username}
              </List.Item>
            ))}
          </List>
        </VStack>
      </div>
    </div>
  );
}

const viewedByData = [
  { id: 1, username: 'user1' },
  { id: 2, username: 'user2' },
];
