import { useAtom } from 'jotai';
import profilePic from '../../assets/profilePic2.png';
import { selectedChatAtom } from '../../utils/atoms';
import './Chat.css';
import { HomePageTemplate } from './HomePageTemplate';

const chatOverviewJson = [
  {
    id: 1,
    name: 'Test',
    image: profilePic,
    message: 'Test Message',
    status: 'Online',
  },
  {
    id: 2,
    name: 'Your Mom',
    image: profilePic,
    message:
      'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
    status: 'Offline',
  },
  {
    id: 3,
    name: 'Your Dad',
    image: profilePic,
    message:
      'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
    status: 'Online',
  },
];

export default function Chat() {
  return <HomePageTemplate page={<ChatPage />} />;
}

function ChatPage() {
  return (
    <div className='home-page-container'>
      <h1>Chat</h1>
      <div className='row chat-container'>
        <ChatOverview />
        <div className='chat-container-vertical-line' />
        <ChatSelected />
      </div>
    </div>
  );
}

function ChatOverview() {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);

  return (
    <div className='col chat-overview-container'>
      {chatOverviewJson.map((c) => (
        <button
          type='button'
          key={c.id}
          className='row chat-overview-item'
          style={{
            backgroundColor: c.id === selectedChat?.id ? '#b394d6' : 'inherit',
          }}
          onClick={() => {
            setSelectedChat(c);
          }}
        >
          <div>
            <img src={c.image} className='profile-picture' />
          </div>

          <div className='chat-overview-item-text'>
            <h2>{c.name}</h2>
            <p>{c.message}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ChatSelected() {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);

  if (selectedChat === null) return null;

  return (
    <div className='chat-selected-container col'>
      <div className='chat-selected-header row'>
        <div>
          <img src={selectedChat?.image} className='profile-picture' />
        </div>
        <div className='chat-overview-item-text'>
          <h2>{selectedChat?.name}</h2>
          <p>{selectedChat?.status}</p>
        </div>
      </div>

      <div className='chat-container-horizontal-line' />
    </div>
  );
}
