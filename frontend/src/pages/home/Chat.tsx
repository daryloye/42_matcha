import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Avatar, Badge, HStack, Tag, Textarea, VStack } from 'rsuite';
import profilePic from '../../assets/profilePic2.png';
import { selectedChatAtom } from '../../utils/atoms';
import { HomePageTemplate } from './HomePageTemplate';

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

export default function Chat() {
  return <HomePageTemplate page={<ChatPage />} />;
}

function ChatPage() {
  return (
    <div>
      <h1>Chat</h1>
      <div className='flex-1 mt-5 min-h-0 border'>
        <div className='flex flex-row h-[65vh]'>
          <ChatSidebar />
          <ChatSelected />
        </div>
      </div>
    </div>
  );
}

function ChatSidebar() {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);

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
          onClick={() => {
            setSelectedChat(c);
          }}
        >
          <Avatar src={c.image} size='lg' circle className='shrink-0' />

          <VStack className='flex-1 min-w-0 overflow-hidden'>
            <p className='text-xl w-full font-bold truncate'>{c.name}</p>
            <p className='w-full truncate'>{c.messages?.at(-1)?.message}</p>
          </VStack>
        </div>
      ))}
    </div>
  );
}

function ChatSelected() {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
  const [message, setMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (!selectedChat || !message || !message.trim()) return;

      setSelectedChat({
        ...selectedChat,
        messages: [
          ...selectedChat.messages,
          { from: 'user', message: message },
        ],
      });

      setMessage('');
    }
  };

  useEffect(
    () => messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' }),
    [selectedChat?.messages],
  );

  if (!selectedChat)
    return (
      <div className='flex flex-1 items-center justify-center h-full'>
        <h1>select a chat</h1>
      </div>
    );

  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden'>
      {/* Header */}
      <HStack background='var(--color-link-hover)' className='p-2 shrink-0'>
        <Avatar src={selectedChat.image} size='lg' circle />

        <VStack className='overflow-hidden'>
          <p className='text-xl font-bold w-full truncate'>
            {selectedChat.name}
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
        {selectedChat.messages.map((item, idx) => (
          <div
            key={idx}
            className={`flex ${item.from === 'user' ? 'justify-end pl-20' : 'justify-start pr-20'}`}
          >
            <Tag
              color={item.from === 'user' ? 'lightblue' : 'white'}
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
        value={message}
        onChange={setMessage}
        onKeyDown={handleSendMessage}
        size='lg'
        className='shrink-0'
      />
    </div>
  );
}
