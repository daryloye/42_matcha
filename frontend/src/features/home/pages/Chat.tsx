import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import profilePic from '../../../assets/profilePic2.png';
import { selectedChatAtom } from '../../../utils/atoms';
import '../chat.css';
import { HomePageTemplate } from '../components/HomePageTemplate';

const chatOverviewJson = [
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
    <div className='home-page-container col'>
      <h1>Chat</h1>
      <div className='row chat-container'>
        <ChatSidebar />
        <ChatSelected />
      </div>
    </div>
  );
}

function ChatSidebar() {
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
            <img src={c.image} className='chat-profile-picture' />
          </div>

          <div className='chat-overview-item-text'>
            <h2>{c.name}</h2>
            <p>{c.messages?.at(-1)?.message}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ChatSelected() {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const text = inputRef.current?.value;
      if (!selectedChat || !text || !text.trim()) return;

      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, { from: 'user', message: text }],
      });
      inputRef.current!.value = '';
    }
  };

  useEffect(
    () => messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' }),
    [selectedChat?.messages],
  );

  if (!selectedChat) return null;

  return (
    <div className='chat-selected-container col'>
      {/* Header */}
      <div className='chat-selected-header row'>
        <div>
          <img src={selectedChat.image} className='chat-profile-picture' />
        </div>
        <div className='chat-overview-item-text'>
          <h2>{selectedChat.name}</h2>
          <p>{selectedChat.status}</p>
        </div>
      </div>

      {/* Messages */}
      <div className='chat-box col'>
        {selectedChat.messages.map((item, idx) => (
          <div
            key={idx}
            className={
              item.from === 'user' ? 'chat-box-user' : 'chat-box-other'
            }
          >
            <p>{item.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <textarea
        className='chat-input'
        placeholder='Message'
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
