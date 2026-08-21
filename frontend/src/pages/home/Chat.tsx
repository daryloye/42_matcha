import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Badge,
  HStack,
  Notification,
  Tag,
  Textarea,
  VStack,
  useToaster,
} from 'rsuite';
import { GetMessages, SendMessage } from '../../api/chat';
import { GetConnectedUsers } from '../../api/match';
import { HomePageTemplate } from './HomePageTemplate';
import { getPictureSrc } from '../../utils/utils';
import { connectSocket } from '../../api/socket';

export default function Chat() {
  return <HomePageTemplate page={<ChatPage />} />;
}

function ChatPage() {
  const [selectedChatUser, setSelectedChatUser] = useState<any>(null);
  const [connectedUsers, setConnectedUsers] = useState<any>([]);

  const toaster = useToaster();
  
  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const res = await GetConnectedUsers();
        setConnectedUsers(res.profiles);
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
      <header>Chat</header>
      <div className='flex-1 mt-5 min-h-0 border'>
        <div className='flex flex-row h-[65vh]'>
          <ChatSidebar connectedUsers={connectedUsers} setSelectedChatUser={setSelectedChatUser} selectedChatUser={selectedChatUser} />
          <ChatSelected selectedChatUser={selectedChatUser} />
        </div>
      </div>
    </div>
  );
}

function ChatSidebar({
  connectedUsers,
  setSelectedChatUser,
  selectedChatUser,
}: {
  connectedUsers: any,
  setSelectedChatUser: any;
  selectedChatUser: any;
}) {
  return (
  <div className='flex flex-col w-[35%] h-full overflow-y-auto border-r'>
    {connectedUsers.length === 0
    ? <div className='flex flex-1 items-center justify-center text-center h-full'>
        <h1>You have no connections</h1>
      </div>
    : connectedUsers.map((c: any) => (
      <div
        role='button'
        tabIndex={0}
        key={c.id}
        className={`flex items-center gap-3 p-2 w-full overflow-hidden text-left border-b ${
          c.id === selectedChatUser?.id
            ? 'bg-[var(--color-link-hover)]'
            : 'hover:bg-[rgba(179,148,214,0.25)]'
        }`}
        onClick={() => setSelectedChatUser(c)}
      >
        <Avatar 
          src={getPictureSrc(c.profile_picture[0].image_url) ?? import.meta.env.VITE_PLACEHOLDER_IMAGE}
          size='lg' 
          circle
          className='shrink-0' />
        <p className='text-xl w-full font-bold truncate'>{c.first_name} {c.last_name}</p>
      </div>
    ))}
  </div>
  );
}

function ChatSelected({ selectedChatUser }: { selectedChatUser: any }) {
  const [messageToSend, setMessageToSend] = useState<string>('');
  const [messages, setMessages] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toaster = useToaster();
  
  // load chat history when selectedChatUser is updated
  useEffect(() => {
    if (!selectedChatUser) return;
  
    async function fetchMessages() {
      try {
        const res = await GetMessages(selectedChatUser?.id);
        setMessages(res['messages']);
      } catch (err: any) {
        toaster.push(
          <Notification type='error' closable>
            {err.message}
          </Notification>,
        );
      }
    }

    const socket = connectSocket();

    const handleIncomingChat = () => {
      fetchMessages();
    }
    
    fetchMessages();
  
    socket.on('new_messages', handleIncomingChat);
    return () => {
      socket.off('new_messages', handleIncomingChat);
    }
  }, [selectedChatUser?.id]);
  
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!selectedChatUser)
    return (
      <div className='flex flex-1 items-center justify-center text-center h-full'>
        <h1>select a chat</h1>
      </div>
    );

  const handleSendMessage = async (e: any) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    if (!messageToSend || !messageToSend.trim()) return;

    e.preventDefault();

    try {
      await SendMessage({
        targetId: selectedChatUser.id,
        message: messageToSend,
      });
      const res = await GetMessages(selectedChatUser?.id);
      setMessages(res['messages']);
      setMessageToSend('');
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  };

  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden'>
      {/* Header */}
      <HStack background='var(--color-link-hover)' className='p-2 shrink-0'>
        <Avatar src={getPictureSrc(selectedChatUser.profile_picture[0].image_url) ?? import.meta.env.VITE_PLACEHOLDER_IMAGE} size='lg' circle />

        <VStack className='overflow-hidden'>
          <p className='text-xl font-bold w-full truncate'>
            {selectedChatUser.first_name} {selectedChatUser.last_name}
          </p>

          {/* Online Status */}
          <HStack>
            <Badge compact size='lg' color={selectedChatUser.online ? 'green' : 'red'} />
            <p>
              {selectedChatUser.online
                ? 'Online'
                : `Last seen ${new Date(selectedChatUser.last_seen).toLocaleString('en-GB')}`}
            </p>
          </HStack>
        </VStack>
      </HStack>

      {/* Messages */}
      <div className='flex-1 min-h-0 flex flex-col gap-2 p-2 overflow-y-auto'>
        {messages?.map((item: any) => (
          <div
            key={item.id}
            className={`flex ${item.to_user_id === selectedChatUser.id ? 'justify-end pl-20' : 'justify-start pr-20'}`}
          >
            <Tag
              color={item.to_user_id === selectedChatUser.id ? 'lightblue' : 'white'}
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
