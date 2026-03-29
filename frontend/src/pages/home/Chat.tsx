import { useEffect, useRef, useState } from 'react';
import { Avatar, Badge, HStack, Tag, Textarea, VStack, useToaster, Notification } from 'rsuite';
import profilePic from '../../assets/profilePic2.png';
import { HomePageTemplate } from './HomePageTemplate';
import { getToken } from '../../utils/token';
import { useNavigate } from 'react-router-dom';
import { GetConnectedUsers } from '../../api/match';
import { GetMessages, SendMessage } from '../../api/chat';

const chatSidebarJson = [
  {
    id: 1,
    name: 'Test',
    image: profilePic,
    status: 'Online',
    messages: [
      { from: 'user', message: 'hello from me' },
      { from: 'other', message: 'hello from friend' },
    ],
  },
  {
    id: 2,
    name: 'Your Mom',
    image: profilePic,
    status: 'Offline',
    messages: [
      { from: 'user', message: 'hello from me' },
      { from: 'user', message: 'hello from me again' },
      { from: 'other', message: 'hello from friend' },
      { from: 'user', message: 'hello from me' },
      { from: 'user', message: 'hello from me again' },
      { from: 'other', message: 'hello from friend' },
      { from: 'user', message: 'hello from me' },
      { from: 'user', message: 'hello from me again' },
      { from: 'other', message: 'hello from friend' },
      { from: 'user', message: 'hello from me' },
      { from: 'user', message: 'hello from me again' },
      {
        from: 'other',
        message:
          'hello from friend hello from friend hello from friend hello from friend hello from friendvhello from friendhello from friend hello from friend hello from friend hello from friend ',
      },
    ],
  },
  {
    id: 3,
    name: 'Your Dad',
    image: profilePic,
    status: 'Online',
    messages: [
      { from: 'user', message: 'hello from me' },
      { from: 'user', message: 'hello from me again' },
      { from: 'other', message: 'hello from friend' },
    ],
  },
];

const test_user = '450d84f8-c8ae-4842-a87d-b9a0839ab2a8';

export default function Chat() {
  return <HomePageTemplate page={<ChatPage />} />;
}

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [selectedChatId, setselectedChatId] = useState<string>('');
  const [connetedUsers, setConnectedUsers] = useState<String[]>([]);  

  const toaster = useToaster();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    async function fetchConnectedUsers() {
      try {
        const res = await GetConnectedUsers(token!);
        console.log(res['connectedUsers']);

        setConnectedUsers(res['connectedUsers']);
      } catch (err: any) {
        toaster.push(
          <Notification type='error' closable>
            {err.message}
          </Notification>,
        );
      }
    }

    fetchConnectedUsers();

    const interval = setInterval(fetchConnectedUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      <div className='flex-1 mt-5 min-h-0 border'>
        <div className='flex flex-row h-[65vh]'>
          <ChatSidebar setselectedChatId={setselectedChatId} selectedChat={selectedChat} />
          <ChatSelected selectedChatId={selectedChatId} />
        </div>
      </div>
    </div>
  );
}

function ChatSidebar({setselectedChatId, selectedChat} : {setselectedChatId: any, selectedChat: any}) {
  return (
    <div className='flex flex-col w-[35%] h-full overflow-y-auto border-r'>
      {chatSidebarJson.map((c) => (
        <div
          role='button'
          tabIndex={0}
          key={c.id}
          className={`flex items-center gap-3 p-2 w-full overflow-hidden text-left border-b ${
            c.id === selectedChat?.id
              ? 'bg-[var(--color-link-hover)]'
              : 'hover:bg-[rgba(179,148,214,0.25)]'
          }`}
          onClick={() => { setselectedChatId(test_user) }}
        >
          <Avatar src={c.image} size='lg' circle className='shrink-0' />
          <p className='text-xl w-full font-bold truncate'>{c.name}</p>
        </div>
      ))}
    </div>
  );
}

function ChatSelected({selectedChatId} : {selectedChatId: any}) {
  const [messageToSend, setMessageToSend] = useState<string>('');
  const [messages, setMessages] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toaster = useToaster();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    async function fetchMessages() {
      try {
        const res = await GetMessages(token!, test_user);
        setMessages(res['messages']);
      } catch (err: any) {
        toaster.push(
          <Notification type='error' closable>
            {err.message}
          </Notification>,
        );
      }
    }

    fetchMessages();

    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: any) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    if (!messageToSend || !messageToSend.trim()) return;

    e.preventDefault();

    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    try {
      await SendMessage(token, {
        targetId: selectedChatId,
        message: messageToSend,
      });
      const res = await GetMessages(token!, test_user);
      setMessages(res['messages']);
      setMessageToSend('')
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  };

  useEffect(
    () => messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' }),
    [],
  );    // TODO: scroll into view on load

  if (!selectedChatId)
    return (
      <div className='flex flex-1 items-center justify-center h-full'>
        <h1>select a chat</h1>
      </div>
    );

  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden'>
      {/* Header */}
      <HStack background='var(--color-link-hover)' className='p-2 shrink-0'>
        <Avatar src={chatSidebarJson[0].image} size='lg' circle />

        <VStack className='overflow-hidden'>
          <p className='text-xl font-bold w-full truncate'>
            {chatSidebarJson[0].name}
          </p>

          {/* Online Status */}
          <HStack>
            <Badge compact size='lg' color={1 ? 'green' : 'red'} />
            <p>Online {1 ? '' : 'last seen'}</p>
          </HStack>
        </VStack>
      </HStack>

      {/* Messages */}
      <div className='flex-1 min-h-0 flex flex-col gap-2 p-2 overflow-y-auto'>
        {messages.map((item: any) => (
          <div
            key={item.id}
            className={`flex ${item.to_user_id === selectedChatId ? 'justify-end pl-20' : 'justify-start pr-20'}`}
          >
            <Tag
              color={item.to_user_id === selectedChatId ? 'lightblue' : 'white'}
              size='lg'
              className='break-all whitespace-pre-wrap'
            >
              {item.message}
            </Tag>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <Textarea
        placeholder='Message'
        rows={1}
        value={messageToSend}
        onChange={setMessageToSend}
        onKeyDown={handleSendMessage}
        size='lg'
        className='shrink-0'
      />
    </div>
  );
}
