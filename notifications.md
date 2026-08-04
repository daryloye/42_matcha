# Wiring backend notifications to the frontend (feat/frontend-notifications)

This documents every change made to get real-time notifications flowing:
`match.controller.ts` (likes/matches/views/unlikes) → Socket.IO → React sidebar bell.

Two channels are involved:
- **REST** (`GET /api/notifications`, `PATCH /api/notifications/read`) — notification *history*, already existed on the backend.
- **Socket.IO** (`notification` event) — *live push* while the user has the app open, already emitted by `match.controller.ts`, but nothing on the frontend was listening.

---

## 0. Bug found along the way: Socket.IO wasn't actually reachable

`backend/src/server.ts` created a Socket.IO server attached to a plain `http` server (`createServer(app)`), but that server was never `.listen()`ed — a *separate* `https.createServer(app)` at the bottom of the file was the one actually serving traffic. Socket.IO was attached to a server that never started, so no socket connection could ever succeed, regardless of what the frontend did.

**File:** `backend/src/server.ts`

**Find:**
```ts
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io"; //library
```
```ts
const app: Application = express(); //Express application. Its job is to handle standard requests (HTTP).
const httpServer = createServer(app); //Node js httpServer

//this is for the handshake; a walkie talkie system for talking and pushes updates
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
```

**Replace with:**
```ts
import helmet from "helmet";
import { Server as SocketIOServer } from "socket.io"; //library
```
```ts
const app: Application = express(); //Express application. Its job is to handle standard requests (HTTP).

// The app is actually served over HTTPS (see httpsServer below) — Socket.IO must
// attach to that same server instance, otherwise it never receives any traffic.
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("/certs/localhost-key.pem"),
    cert: fs.readFileSync("/certs/localhost.pem"),
  },
  app,
);

//this is for the handshake; a walkie talkie system for talking and pushes updates
const io = new SocketIOServer(httpsServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
```

And at the bottom of the file:

**Find:**
```ts
// const PORT = process.env.BACKEND_PORT || process.env.PORT || 5001;

// httpServer.listen(PORT, async () => {
//   ...
// });

https.createServer(
  {
    key: fs.readFileSync("/certs/localhost-key.pem"),
    cert: fs.readFileSync("/certs/localhost.pem"),
  },
  app,
).listen(process.env.BACKEND_PORT, async () => {
```

**Replace with:**
```ts
httpsServer.listen(process.env.BACKEND_PORT, async () => {
```

(The `key`/`cert` reading now happens once, up top, and both Express and Socket.IO share the one running server.)

---

## 1. Backend: authenticate the socket handshake via cookie, not `auth.token`

The JWT lives in an httpOnly `access_token` cookie (set in `auth.controller.ts` on login). httpOnly means frontend JS **cannot read it**, so it can never be handed to Socket.IO via `io(url, { auth: { token } })`. The old middleware expected exactly that and would always reject real browser clients.

Cookies aren't passed through `auth` — they ride along in the HTTP handshake automatically, *if* the client connects with `withCredentials: true` (see step 3) and the server's CORS allows credentials (it already did: `cors: { credentials: true }`).

**File:** `backend/src/server.ts`

**Find:**
```ts
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if(!token){
    return next(new Error("Authentication Error"));
  }
  try{
    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
      throw new Error("JWT_SECRET not defined");
    } 
      const decoded = jwt.verify(token, jwtSecret!) as unknown as { userId: string};
      socket.data.userId = decoded.userId;
      next();
  }catch{
    next (new Error("Authentication error"))
  }
})
```

**Replace with:**
```ts
io.use((socket, next) => {
  // The JWT lives in an httpOnly cookie, so the browser can't hand it to us via
  // `auth.token` — it rides along in the handshake's raw Cookie header instead
  // (client must connect with `withCredentials: true`).
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) {
    return next(new Error("Authentication Error"));
  }

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((pair) => {
      const [key, ...rest] = pair.split("=");
      return [key, decodeURIComponent(rest.join("="))];
    }),
  );

  const token = cookies["access_token"];
  if (!token) {
    return next(new Error("Authentication Error"));
  }

  try{
    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
      throw new Error("JWT_SECRET not defined");
    }
      const decoded = jwt.verify(token, jwtSecret!) as unknown as { userId: string};
      socket.data.userId = decoded.userId;
      next();
  }catch{
    next (new Error("Authentication error"))
  }
})
```

Everything downstream of this (`socket.join(userId)`, `io.to(targetId).emit('notification', ...)` in `match.controller.ts`) was already correct and needed no changes.

**Verified via curl** (no browser needed for this layer): a namespace-connect packet without the `access_token` cookie gets `44{"message":"Authentication Error"}`; with the cookie it gets `40{"sid":"..."}` (success).

---

## 2. Frontend: install the Socket.IO client

```bash
cd frontend
npm install socket.io-client
```

Adds `socket.io-client` to `frontend/package.json` dependencies.

---

## 3. Frontend: one shared socket connection

New file — not editing an existing one.

**File:** `frontend/src/api/socket.ts` (new)

```ts
import { io, type Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;

let socket: Socket | null = null;

// The JWT lives in an httpOnly cookie, so we never touch it directly here —
// `withCredentials: true` makes the browser attach it to the socket handshake,
// same as it does for the fetch calls in httpClient.tsx.
export function connectSocket(): Socket {
  if (socket) return socket;

  socket = io(API_URL, {
    withCredentials: true,
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
```

Why a singleton: `HomePageTemplate` (see step 6) remounts on every route change since there's no persistent layout wrapper in `main.tsx` — each page (`/search`, `/chat`, `/profile`, `/account`) is its own `<Route>`. Without a module-level singleton, navigating between pages would tear down and reopen the socket constantly. `connectSocket()` is idempotent — calling it again just returns the existing connection.

---

## 4. Frontend: REST calls for notification history

Mirrors the pattern already used in `chat.tsx` / `auth.tsx`.

**File:** `frontend/src/api/notification.tsx` (new)

```tsx
import { GetHTTP, PatchHTTP } from './httpClient';

export async function GetNotifications() {
  return await GetHTTP(
    '/api/notifications',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function MarkNotificationsRead() {
  return await PatchHTTP(
    '/api/notifications/read',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}
```

This needed a `PatchHTTP` helper that didn't exist yet — `httpClient.tsx` only had `PostHTTP`/`GetHTTP`/`DeleteHTTP`.

**File:** `frontend/src/api/httpClient.tsx`

**Find:**
```ts
export async function DeleteHTTP(endpoint: string, headers: HeadersInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: headers,
    credentials: 'include',
  });
```

**Replace with (insert `PatchHTTP` above `DeleteHTTP`, `DeleteHTTP` itself is unchanged below it):**
```ts
export async function PatchHTTP(
  endpoint: string,
  headers: HeadersInit,
  body?: string,
) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: headers,
    body: body,
    credentials: 'include',
  });

  const data = await res.json();

  if (res.status === 401) {
    window.location.href = '/';
  }

  if (res.status === 403 && data?.code === 'PROFILE_INCOMPLETE') {
    window.location.href = '/profile?reason=profile_incomplete';
  }

  if (!res.ok) {
    throw new Error(data?.error || 'Unknown error');
  }

  return data;
}

export async function DeleteHTTP(endpoint: string, headers: HeadersInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: headers,
    credentials: 'include',
  });
```

---

## 5. Frontend: a shared type for a notification

**File:** `frontend/src/utils/types.ts`

**Find:**
```ts
export type PictureItem = {
  file: File;
  url: string;
};
```

**Replace with:**
```ts
export type PictureItem = {
  file: File;
  url: string;
};

export type AppNotification = {
  id: number;
  user_id: string;
  from_user_id: string;
  type: 'like' | 'match' | 'view' | 'unlike';
  is_read: boolean;
  created_at: string;
};
```

(`type` values match exactly what `match.controller.ts` emits: `'like' | 'match' | 'view' | 'unlike'`.)

---

## 6. Frontend: connect the socket once logged in, disconnect on logout

`HomePageTemplate.tsx` already fetches the logged-in user's profile on mount (`fetchBasicProfile`) — a successful fetch proves the `access_token` cookie is valid, so that's the right moment to open the socket.

**File:** `frontend/src/pages/home/HomePageTemplate.tsx`

**Find:**
```tsx
import { GetBasicProfile } from '../../api/profile';
import type { BasicProfile } from '../../utils/types';
import { Logout } from '../../api/auth';
import { getPictureSrc } from '../../utils/utils';
```

**Replace with:**
```tsx
import { GetBasicProfile } from '../../api/profile';
import type { AppNotification, BasicProfile } from '../../utils/types';
import { Logout } from '../../api/auth';
import { getPictureSrc } from '../../utils/utils';
import { GetNotifications, MarkNotificationsRead } from '../../api/notification';
import { connectSocket, disconnectSocket } from '../../api/socket';
```

**Find:**
```tsx
  // Get user profile
  useEffect(() => {
    fetchBasicProfile();

    const interval = setInterval(fetchBasicProfile, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!basicProfile) return null;
```

**Replace with:**
```tsx
  // Get user profile
  useEffect(() => {
    fetchBasicProfile();

    const interval = setInterval(fetchBasicProfile, 10000);
    return () => clearInterval(interval);
  }, []);

  // A successful basicProfile fetch means the httpOnly access_token cookie is
  // valid, so it's safe to open the socket. connectSocket() is a no-op if a
  // connection already exists (e.g. navigating between pages).
  useEffect(() => {
    if (!basicProfile) return;
    connectSocket();
  }, [basicProfile]);

  if (!basicProfile) return null;
```

**Find** (the logout link, inside `NavigationLinks`):
```tsx
      <Link to='/' onClick={async () => { await Logout() }}>
        <h1>Logout</h1>
```

**Replace with:**
```tsx
      <Link to='/' onClick={async () => { disconnectSocket(); await Logout() }}>
        <h1>Logout</h1>
```

---

## 7. Frontend: replace the mocked sidebar notifications with real ones

The `Sidebar` component already had a bell icon + `Popover` + `Badge` UI — it was just backed by 10 hardcoded fake messages. This swaps that mock state for: an initial `GET /api/notifications` load, a live `socket.on('notification', ...)` listener for push updates, and `PATCH /api/notifications/read` when the bell is opened.

**File:** `frontend/src/pages/home/HomePageTemplate.tsx`

**Find:**
```tsx
function Sidebar({ profile }: { profile: BasicProfile }) {
  const [messages, setMessages] = useState([
    { key: 1, value: 'You have a new follower.' },
    { key: 2, value: 'User1 wants to chat.' },
    { key: 3, value: 'User1 wants to chat.' },
    { key: 4, value: 'You have a new follower.' },
    { key: 5, value: 'You have a new follower.' },
    { key: 6, value: 'You have a new follower.' },
    { key: 7, value: 'You have a new follower.' },
    { key: 8, value: 'You have a new follower.' },
    { key: 9, value: 'You have a new follower.' },
    { key: 10, value: 'You have a new follower.' },
  ]);

  const handleMessageClose = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.key !== id));
  };

  const speaker = (
    <Popover title='Notifications' className='max-h-128 w-64 overflow-y-scroll'>
      {messages.length > 0 ? (
        messages.map((m) => (
          <Message
            closable
            key={m.key}
            onClose={() => handleMessageClose(m.key)}
          >
            {m.value}
          </Message>
        ))
      ) : (
        <div>
          <p>You have no notifications.</p>
          <p>Go touch some grass.</p>
        </div>
      )}
    </Popover>
  );

  return (
    <div className='home-sidebar flex flex-col gap-4'>
      <HStack spacing={15}>
        <Avatar src={getPictureSrc(profile.picture)} size='xl' circle />

        <Tag color='red' size='lg'>
          <HeartIcon /> {profile.fame_rating}
        </Tag>

        <Whisper placement='rightStart' trigger='click' speaker={speaker}>
          <Badge
            content={messages.length}
            className={messages.length > 0 ? 'animate-bounce' : ''}
          >
            <IconButton
              icon={<NoticeIcon />}
              appearance='subtle'
              circle
              size='lg'
              className='notification-btn'
            />
          </Badge>
        </Whisper>
      </HStack>

      <p className='text-xl font-bold truncate'>
        Welcome {profile.first_name}!
      </p>

      <NavigationLinks />
    </div>
  );
}
```

**Replace with:**
```tsx
const NOTIFICATION_LABELS: Record<AppNotification['type'], string> = {
  like: 'Someone liked your profile.',
  match: "It's a match!",
  view: 'Someone viewed your profile.',
  unlike: 'A connection unliked you.',
};

function Sidebar({ profile }: { profile: BasicProfile }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const toaster = useToaster();

  // Load notification history once on mount.
  useEffect(() => {
    GetNotifications()
      .then((res) => setNotifications(res.notifications))
      .catch(() => {});
  }, []);

  // Live push: the server emits `notification` to this user's personal room
  // (see match.controller.ts) any time someone likes/views/matches/unlikes them.
  useEffect(() => {
    const socket = connectSocket();

    const handleNotification = (payload: { type: AppNotification['type']; fromId: string }) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          user_id: '',
          from_user_id: payload.fromId,
          type: payload.type,
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      toaster.push(
        <Notification type='info' closable>
          {NOTIFICATION_LABELS[payload.type]}
        </Notification>,
      );
    };

    socket.on('notification', handleNotification);
    return () => {
      socket.off('notification', handleNotification);
    };
  }, [toaster]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleOpen = () => {
    if (unreadCount === 0) return;
    MarkNotificationsRead()
      .then(() => setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true }))))
      .catch(() => {});
  };

  const handleMessageClose = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const speaker = (
    <Popover title='Notifications' className='max-h-128 w-64 overflow-y-scroll'>
      {notifications.length > 0 ? (
        notifications.map((n) => (
          <Message
            closable
            key={n.id}
            onClose={() => handleMessageClose(n.id)}
          >
            {NOTIFICATION_LABELS[n.type]}
          </Message>
        ))
      ) : (
        <div>
          <p>You have no notifications.</p>
          <p>Go touch some grass.</p>
        </div>
      )}
    </Popover>
  );

  return (
    <div className='home-sidebar flex flex-col gap-4'>
      <HStack spacing={15}>
        <Avatar src={getPictureSrc(profile.picture)} size='xl' circle />

        <Tag color='red' size='lg'>
          <HeartIcon /> {profile.fame_rating}
        </Tag>

        <Whisper placement='rightStart' trigger='click' speaker={speaker} onOpen={handleOpen}>
          <Badge
            content={unreadCount}
            className={unreadCount > 0 ? 'animate-bounce' : ''}
          >
            <IconButton
              icon={<NoticeIcon />}
              appearance='subtle'
              circle
              size='lg'
              className='notification-btn'
            />
          </Badge>
        </Whisper>
      </HStack>

      <p className='text-xl font-bold truncate'>
        Welcome {profile.first_name}!
      </p>

      <NavigationLinks />
    </div>
  );
}
```

Note: `unreadCount` (not total notification count) now drives the badge — matches the `is_read` field the backend already tracks.

---

## Data flow, end to end

```
User A likes User B
  -> match.controller.ts: updateMatchHandler()
       -> createNotification(userB.id, userA.id, 'like')   [writes to Postgres]
       -> io.to(userB.id).emit('notification', { type: 'like', fromId: userA.id })

User B's browser (already connected, socket.join(userB.id) happened on connect)
  -> Sidebar's socket.on('notification', ...) fires
       -> prepend to local `notifications` state
       -> toast pops up
       -> badge count increments (unread)

User B opens the bell (Whisper `onOpen`)
  -> PATCH /api/notifications/read -> markNotificationsAsRead(userB.id) in Postgres
       -> local state's is_read flips to true -> badge clears

Next login / page load
  -> GET /api/notifications -> full history, including anything missed while offline
```

---

## Manual test checklist

1. `docker compose -f docker-compose.dev.yml restart backend frontend` (pick up the `server.ts` fix + new `socket.io-client` dependency).
2. Open two browser sessions (or one normal + one incognito), log in as two different seeded/test users who aren't already connected.
3. In DevTools Network tab (session B), confirm a `wss://localhost:5001/socket.io/...` connection is `101 Switching Protocols`.
4. From session A, like session B's profile.
5. In session B: a toast should appear within ~1s, the bell badge should increment, and opening the bell should show "Someone liked your profile."
6. Click the bell again (or reload) — badge should be 0, confirming `PATCH /api/notifications/read` worked.
7. Log out of session B, log back in — `GET /api/notifications` should still show the like in history.
