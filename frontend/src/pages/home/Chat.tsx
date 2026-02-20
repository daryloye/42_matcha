import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import profilePic from '../../assets/profilePic2.png';
import { HomePageTemplate } from '../../components/home/HomePageTemplate';
import { selectedChatAtom } from '../../utils/atoms';
import styles from './Chat.module.css';

// const chatMenu = [
//   {
//     conversationId: 111,
//     otherUserId: 1,
//     lastMessage:
//     lastCreatedTime:
//     unreadCount: 3
//   }
// ]

// const conversation = [
//   {
//     id: 1,
//     from: 'user',
//     message: 'hello'
//   },
//   {
//     id: 2,
//     from: 'me',
//     message: 'hello back'
//   }
// ]

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
    <div className='home-page-layout col'>
      <h1>Chat</h1>
      <div className={styles.chatContainer}>
        <ChatSidebar />
        <ChatSelected />
      </div>
    </div>
  );
}

function ChatSidebar() {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);

  return (
    <div className={styles.chatSidebarContainer}>
      {chatSidebarJson.map((c) => (
        <button
          type='button'
          key={c.id}
          className={styles.chatSidebarItem}
          style={{
            backgroundColor: c.id === selectedChat?.id ? '#b394d6' : 'inherit',
          }}
          onClick={() => {
            setSelectedChat(c);
          }}
        >
          <img src={c.image} className={styles.chatProfilePicture} />

          <div className={styles.chatSidebarItemText}>
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
    <div className={styles.chatSelectedContainer}>
      {/* Header */}
      <div className={styles.chatSelectedHeader}>
        <img src={selectedChat.image} className={styles.chatProfilePicture} />
        <div className={styles.chatSidebarItemText}>
          <h2>{selectedChat.name}</h2>
          <p>{selectedChat.status}</p>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.chatBox}>
        {selectedChat.messages.map((item, idx) => (
          <div
            key={idx}
            className={
              item.from === 'user' ? styles.chatBoxUser : styles.chatBoxOther
            }
          >
            <p>{item.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <textarea
        className={styles.chatInput}
        placeholder='Message'
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
