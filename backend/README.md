# Matcha — Backend

A dating app backend built with TypeScript, Node.js, Express, and PostgreSQL.

> For full project status and build tracker, see [engineering-roadmap.md](./engineering-roadmap.md)

---

## Team

- **Jack** — Backend
- **Daryl** — Frontend

---

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** PostgreSQL 16 (raw SQL, no ORM)
- **Auth:** JWT
- **Email:** Mailgun (SMTP)
- **File uploads:** Multer
- **Real-time:** Socket.IO
- **Containerisation:** Docker

---

## Quick Start

**1. Start Docker:**
```bash
docker compose up --build
```

**2. Verify server is running:**
```bash
curl http://localhost:5001/health
```

**3. Access points:**
- Backend API: `http://localhost:5001`
- Frontend: `http://localhost:5173`
- Database: `localhost:5432`

---

## Environment Variables

All credentials live in `backend/.env` (gitignored). Required keys:

```
NODE_ENV
PORT
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
JWT_SECRET, JWT_EXPIRES_IN
EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD
MAILGUN_API_KEY, MAILGUN_DOMAIN
FRONTEND_URL
MAX_FILE_SIZE, ALLOWED_FILE_TYPES
```

---

## API Routes

### Auth — `/api/auth`
| Method | Route | Description |
|:--|:--|:--|
| POST | `/register` | Register new account |
| GET | `/verify` | Verify email token |
| POST | `/login` | Login (username + password) |
| POST | `/forgot-password` | Request password reset |
| POST | `/reset-password` | Reset password with token |

### Profile — `/api/profile`
| Method | Route | Description |
|:--|:--|:--|
| GET | `/me` | Lightweight profile (navbar data) |
| GET | `/details` | Full profile page data |
| POST | `/details` | Update full profile |
| GET | `/my-profile` | Own profile (raw) |
| POST | `/complete-profile` | Complete profile setup |
| POST | `/update` | Update profile fields |
| POST | `/picture` | Upload a picture |
| POST | `/picture/:pictureId/primary` | Set primary picture |
| DELETE | `/picture/:pictureId` | Delete a picture |
| GET | `/pictures` | Get all pictures |
| GET | `/:id` | View another user's profile |

---

## Database

Connect to the running database:
```bash
docker exec -it matcha-database-1 psql -U matcha_user -d matcha_db
```

Useful commands:
```sql
\dt                  -- list all tables
\d users             -- inspect users table
SELECT * FROM users; -- view all users
```

---

## Seed Account

A default admin account is seeded on startup:
- **Email:** admin@matcha.com
- **Username:** admin
- **Password:** MatchaAdmin2026!