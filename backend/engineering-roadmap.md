# Matcha Dating App — Engineering Roadmap & To-Do Tracker

> **Project:** `matcha`
> **Last updated:** 2026-06-24
> **Active branch:** `feat/browsing-matching`
> **Stack:** TypeScript, Node.js, Express, PostgreSQL 16, Socket.IO, Docker
> **Server:** `app.use("/api/auth", authRouter)` | `app.use("/api/profile", profileRouter)`
> **DB container:** `matcha-database-1` | **Backend:** `matcha-backend-1` | **Frontend:** `matcha-frontend-1`

---

## How to use this tracker

- `[ ]` = Not started
- `[~]` = In progress
- `[x]` = Done
- `[⏸]` = Deferred — reason logged inline
- 🔴 = Blocker / bug — must fix before moving on
- 🟡 = Important gap — fix before shipping phase
- 🟢 = Enhancement / nice to have

---

## Instructions for Claude

> This file is the **source of truth** for the Matcha backend project.
> When this file is uploaded at the start of a session, Claude must
> follow these rules without exception:
>
> 1. **Only touch checkboxes and add notes.** Do not restructure,
>    reorder, rename, condense, or rewrite any existing content.
> 2. **Never delete any item.** If an item was not completed, it stays
>    as `[ ]`. If deferred, mark `[⏸]` and add an inline note.
> 3. **Update this file as work progresses** — check off completed items,
>    add fix notes, and update the header `Last updated` date and
>    `Active branch` at the start of each session.
> 4. **At the end of each session**, generate the updated file for the
>    user to save and commit to the project root.
> 5. **Learning approach:** This developer learns by building. Always explain
>    *why* before showing *what*. Guide with scaffolds before giving full
>    solutions. Correct mistakes as teaching moments. Never hand over
>    complete code without giving the developer a chance to try first.

---

## Database Schema (UUID throughout)

> All tables use UUID primary keys via `uuid_generate_v4()`.
> No ORM — raw SQL only per assignment requirements.

```
users:          id (UUID PK), email, username, first_name, last_name,
                password_hash, is_verified, verification_token,
                reset_token, reset_token_expires, created_at, updated_at

profiles:       id (UUID PK), user_id (UUID FK), gender, sexual_preference,
                biography, date_of_birth, latitude, longitude,
                location_city, fame_rating, created_at, updated_at

profile_pictures: id (UUID PK), user_id (UUID FK), image_url,
                  is_profile_picture, created_at

interests:      id (UUID PK), name (UNIQUE), created_at

user_interests: id (UUID PK), user_id (UUID FK), interest_id (UUID FK),
                created_at, UNIQUE(user_id, interest_id)

relationships:  id (SERIAL PK), user_id (UUID FK), target_user_id (UUID FK),
                status, created_at, UNIQUE(user_id, target_user_id, status)

chat:           id (SERIAL PK), from_user_id (UUID FK), to_user_id (UUID FK),
                message, created_at
```

---

## Phase 1 — Project Setup ✅

- [x] Docker setup (backend, database, frontend containers)
- [x] PostgreSQL connection pool (`config/database.ts`)
- [x] Table initialisation on server start (`config/initDB.ts`)
- [x] UUID extension enabled (`uuid-ossp`)
- [x] All tables created with UUID PKs
- [x] Environment variables (`.env`) — DB, JWT, Mailgun, ports
- [x] Express server with helmet, cors, json middleware (`server.ts`)
- [x] Health check endpoint `GET /health`
- [x] Static file serving for uploads (`app.use("/uploads", express.static("uploads"))`)
- [x] Socket.IO server initialised (connection/disconnect handlers)

---

## Phase 2 — Authentication System ✅

### 2.1 — User Model (`user.model.ts`)
- [x] `createUser(data)` — INSERT with RETURNING id
- [x] `findUserByEmail(email)` — SELECT by email
- [x] `findUserByUsername(username)` — SELECT by username
- [x] `deleteUserById(userId: string)` — DELETE by UUID (used for rollback)
- [x] `setResetToken(email, token, expires)`
- [x] `findUserByResetToken(token)`
- [x] `updatePassword(userId, hash)`
- [x] `clearResetToken(userId)`

### 2.2 — Auth Controller (`auth.controller.ts`)
- [x] `register` — validate formats → check duplicates → hash password → createUser → sendVerificationEmail (rollback via deleteUserById if email fails)
- [x] `verify` — verify email token, set is_verified = true
- [x] `login` — username + password, blocks unverified users, resends verification email on unverified login, returns message + token only
- [x] `forgotPassword` — unified response regardless of email existence (prevents account enumeration)
- [x] `resetPassword` — verify reset token, update password, clear token

### 2.3 — Auth Routes (`auth.routes.ts`)
- [x] `POST /api/auth/register`
- [x] `GET /api/auth/verify`
- [x] `POST /api/auth/login`
- [x] `POST /api/auth/forgot-password`
- [x] `POST /api/auth/reset-password`

### 2.4 — Auth Middleware (`auth.middleware.ts`)
- [x] `requireAuth` — extracts Bearer token from Authorization header, verifies JWT, attaches `req.user = { userId: string, email, username }`

### 2.5 — Types (`user.types.ts`)
- [x] `User` interface — id: string (UUID)
- [x] `RegisterRequest`, `LoginRequest`, `ForgotPasswordRequest`, `ResetPasswordRequest`

### 2.6 — Key design decisions logged
- [x] Register has one job — no resend logic. Login handles resend verification flow.
- [x] Forgot password returns unified message (prevents account enumeration)
- [x] JWT payload: `{ userId, email, username }` — userId is UUID string
- [x] Rollback pattern: if sendVerificationEmail throws after createUser, deleteUserById

---

## Phase 3 — Profile System ✅

### 3.1 — Profile Model (`profile.model.ts`) ✅
- [x] `createBlankProfile(userId: string)`
- [x] `getProfileByUserId(userId: string)`
- [x] `updateProfile(userId: string, data)` — dynamic update, only updates provided fields via Object.entries loop
- [x] `addProfilePicture(userId: string, imageUrl: string)` — max 5 photos enforced, first photo auto-set as primary
- [x] `setProfilePicture(userId: string, pictureId: string)` — single-query toggle trick `SET is_profile_picture = (id = $2)`
- [x] `getProfilePictures(userId: string)` — ordered by primary first
- [x] `getPrimaryProfilePicture(userId: string)`
- [x] `deleteProfilePicture(userId: string, pictureId: string)` — auto-promotes next oldest photo if primary is deleted
- [x] `getProfileMe(userId: string)` — joins users + profiles + profile_pictures, returns username, first_name, last_name, picture, is_profile_completed
- [x] `getProfileDetails(userId: string)` — full profile join including interests[] and pictures[] as JSON arrays via JSON_AGG + COALESCE
- [x] `updateUserInterests(userId: string, interestNames: string[])` — deletes existing interests, upserts new ones via ON CONFLICT

### 3.2 — Multer Middleware (`middleware/multer.ts`) ✅
- [x] diskStorage — saves to `uploads/` folder
- [x] filename — crypto.randomBytes(16) + path.extname for unique filenames
- [x] fileFilter — allows image/jpeg, image/jpg, image/png, image/webp only
- [x] limits — 5MB max file size
- [x] exported as named export `upload`

### 3.3 — Profile Controller (`profile.controller.ts`) ✅
- [x] `completeProfile` — POST, creates blank profile if none exists, updates with provided data
- [x] `getOwnerProfile` — GET, returns own profile
- [x] `getOthersProfile` — GET /:id, returns another user's profile
- [x] `updateOwnProfile` — POST, dynamic update of own profile
- [x] `getMe` — GET, returns lightweight profile (username, first_name, last_name, picture, is_profile_completed)
- [x] `getFullProfileDetails` — GET, returns full profile page data including interests[] and pictures[]
- [x] `uploadProfilePicture` — POST, multer processes file, saves to uploads/, stores path in DB
- [x] `setPrimaryPicture` — POST /:pictureId/primary, marks a picture as profile picture
- [x] `removePicture` — DELETE /:pictureId, removes picture, auto-promotes next
- [x] `getPictures` — GET, returns all pictures for current user
- [x] `updateProfileDetails` — POST /details, updates users + profiles + calls updateUserInterests

### 3.4 — Profile Routes (`profile.routes.ts`) ✅
- [x] `POST /api/profile/complete-profile`
- [x] `GET /api/profile/my-profile`
- [x] `POST /api/profile/update`
- [x] `GET /api/profile/me`
- [x] `GET /api/profile/details`
- [x] `POST /api/profile/picture` — requireAuth → upload.single('picture') → uploadProfilePicture
- [x] `POST /api/profile/picture/:pictureId/primary`
- [x] `DELETE /api/profile/picture/:pictureId`
- [x] `GET /api/profile/pictures`
- [x] `POST /api/profile/details`
- [x] `GET /api/profile/:id` — must stay last (wildcard route)

### 3.5 — isProfileCompleted definition (agreed with frontend)
> All 5 must be true:
> 1. gender is not null
> 2. sexual_preference is not null
> 3. biography is not null
> 4. At least 1 interest in user_interests
> 5. At least 1 picture in profile_pictures

### 3.6 — Frontend-requested endpoints (Daryl)
- [x] `GET /api/profile/me` → returns `{ first_name, last_name, username, picture, isProfileCompleted }`
- [x] `GET /api/profile/details` → returns full profile page data
- [x] `POST /api/profile/details` → updates full profile

### 3.7 — Seed (`database/seed.ts`)
- [x] Admin user seeded (email: admin@matcha.com, username: admin, is_verified: true)
- [x] Admin profile seeded (gender, sexual_preference, biography, date_of_birth, location_city)
- [x] Admin profile picture seeded (is_profile_picture: true)
- [x] Admin interests seeded (coffee, hiking, coding) via upsert + user_interests link
- [x] 500+ fake profiles for evaluation (required by subject)

### 3.8 — User Model additions (`user.model.ts`)
- [x] `updateUser(userId: string, data)` — dynamic update of first_name, last_name, email via Object.entries loop

---

## Phase 4 — Interest System [ ]

> Note: updateUserInterests already exists in profile.model.ts.
> This phase covers any remaining interest management endpoints.

- [ ] 19.1: Verify interest endpoints are fully covered by Phase 3 or add missing ones
- [ ] 19.2: Test interest management end-to-end

---

## Phase 5 — Browsing & Matching System [~]

> Note: Step 20 (Browse/Search), Step 21 (Like/Unlike), Step 22 (View history),
> and Step 23 (Fame rating) were already implemented by Daryl in
> `search.controller.ts`, `search.model.ts`, `match.controller.ts`,
> `match.model.ts`, `match.routes.ts`. This phase now focuses on Step 24
> (Matching algorithm — distance calculation) which had TODOs in
> `search.controller.ts`.

- [x] Step 20: Browse/Search endpoints (Daryl — `search.controller.ts`, `search.model.ts`)
- [x] Step 21: Like/Unlike system (Daryl — `match.controller.ts`, `match.model.ts`)
- [x] Step 22: Profile view history tracking (Daryl — `getViewData`, matchStatus.VIEW)
- [x] Step 23: Fame rating calculation (Daryl — `increaseUserFame` calls in match.controller.ts)
- [~] Step 24: Matching algorithm
  - [x] 24.1: `utils/geo.ts` — Haversine formula for distance calculation
  - [x] 24.2: Sort suggestions by proximity — `.sort()` comparator in `getRecommendedSearchHandler`; nulls pushed to end. Typed via `RecommendedProfileRow` + `RecommendedProfile` in `search.types.ts`; `search.model.ts` return type updated; controller refactored from mutate+delete to `.map()` transformation.
  - [ ] 24.3: Filter by max distance
  - [ ] 24.4: Combine criteria (tags, fame rating, gender/preference) — sexual_preference filter still TODO in search.model.ts
  - [ ] 24.5: Browsing list sortable by age, location, fame rating, common tags
  - [ ] 24.6: Browsing list filterable by age, location, fame rating, common tags
- [ ] Step 25: Advanced search (age range, fame range, location, interest tags)

---

## Phase 6 — Real-time Chat (Socket.IO) [ ]

- [ ] Step 26: Messages table (schema + migration)
- [ ] Step 27: Message model (`message.model.ts`)
- [ ] Step 28: Chat controller (`chat.controller.ts`)
- [ ] Step 29: Socket.IO chat setup
  - [ ] Join/leave room on connect/disconnect
  - [ ] Send message event
  - [ ] Receive message event
  - [ ] Max 10 second delay requirement
- [ ] Step 30: Chat routes
- [ ] Step 31: Only connected users (mutual likes) can chat

---

## Phase 7 — Notifications System [ ]

- [ ] Step 32: Notifications table (schema + migration)
- [ ] Step 33: Notification model (`notification.model.ts`)
- [ ] Step 34: Notification controller
- [ ] Step 35: Real-time notifications via Socket.IO
  - [ ] When user receives a like
  - [ ] When profile has been viewed
  - [ ] When user receives a message
  - [ ] When a liked user likes back (match)
  - [ ] When a connected user unlikes
  - [ ] Max 10 second delay requirement
- [ ] Unread notification indicator visible from any page

---

## Phase 8 — Additional Features [ ]

- [ ] Block user system (blocked user disappears from search + no notifications)
- [ ] Report fake account system
- [ ] Profile view tracking (users can see who viewed their profile)
- [ ] Like history (users can see who liked them)
- [ ] Online status + last seen timestamp
- [ ] Unlike / disconnect flow (disables chat between users)
- [ ] Fame rating public display on profiles

---

## Phase 9 — Seeding & Evaluation Prep [~]

- [x] Seed 500+ distinct fake profiles (required by subject for evaluation)
- [x] Each fake profile needs: gender, sexual_preference, biography, interests, pictures, location
- [x] Profiles must cover varied genders, preferences, locations for matching algorithm testing
- [ ] Write full schema into `001_initial_schema.sql` for version control

---

## Phase 10 — Security & Final Checks [ ]

> Subject requirement: any security breach = score of 0

- [ ] Confirm no plain-text passwords in database
- [ ] Confirm all SQL uses parameterised queries (no injection vectors)
- [ ] Validate all form inputs server-side
- [ ] Validate all file uploads (type + size enforced)
- [ ] No HTML/JS injection in unprotected variables
- [ ] All credentials in `.env`, excluded from Git
- [ ] No errors, warnings, or notices server-side or client-side
- [ ] Test on latest Firefox and Chrome

---

backend/
  src/
    config/
      database.ts
      initDB.ts
    controllers/
      auth.controller.ts
      chat.controller.ts        (Daryl's)
      match.controller.ts       (Daryl's)
      profile.controller.ts
      search.controller.ts      (Daryl's)
    database/
      migrations/
        001_initial_schema.sql  (still empty!)
      seed.ts
    middleware/
      auth.middleware.ts
      multer.ts
    models/
      chat.model.ts             (Daryl's)
      match.model.ts            (Daryl's)
      profile.model.ts
      search.model.ts           (Daryl's)
      user.model.ts
    routes/
      auth.routes.ts
      chat.routes.ts            (Daryl's)
      match.routes.ts           (Daryl's)
      profile.routes.ts
      search.routes.ts          (Daryl's)
    types/
      chat.types.ts             (Daryl's)
      match.types.ts            (Daryl's)
      search.types.ts           (RecommendedProfileRow, RecommendedProfile)
      user.types.ts
    utils/
      geo.ts                    (calculateDistance — Haversine formula)
    server.ts
  uploads/                      (gitignored, persists in container)
  .env                          (gitignored)
  Dockerfile
  package.json
  tsconfig.json
  engineering-roadmap.md
  profiles.json

---

## Summary Table

| Phase | Description | Status |
|:--|:--|:--|
| 1 | Project Setup | ✅ Complete |
| 2 | Authentication System | ✅ Complete |
| 3 | Profile System | ✅ Complete |
| 4 | Interest System | ⬜ Not started |
| 5 | Browsing & Matching | 🟡 In Progress |
| 6 | Real-time Chat | ⬜ Not started |
| 7 | Notifications | ⬜ Not started |
| 8 | Additional Features | ⬜ Not started |
| 9 | Seeding & Eval Prep | 🟡 In Progress |
| 10 | Security & Final Checks | ⬜ Not started |

---