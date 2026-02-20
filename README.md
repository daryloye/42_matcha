# 42_Matcha

Contributors:

- Daryl (@daong)
- Jack (@ysng)

## How to run

### Start the application:

```
make up
```

Services:

- Frontend client runs on http://localhost:3000
- Backend API runs on http://localhost:5001

### Stop the application:

```
make down
```

### Remove containers and volumens:

```
make docker-reset
```

### Development build (for vite hot reload)

```
make dev
```

### Run API tests with Bruno (after the application is running):

```
make test
```

### Install project dependencies:

```
make install
```

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Vite

- Backend:
  - Node.js
  - Express
  - PostgreSQL

- Testing:
  - Bruno

### Issues List

Register

- if the registration fails because the email is invalid, and then the user submits again, will receive "username already exist" error. In this case the info should not have been added to the DB so that the user can resubmit the form.
- if the user submits using an email that has already been registered but not yet verified, will receive "email is already registered" error. Maybe this can be changed to sending the verification email again?

- (for me to fix) spamming the button will lead to errors, FE needs to block the button while waiting for the fetch

Forgot Password

- if user has not verified but lost the verification email, he is not able to get the password reset link

Verify

- why is it Get HTTP instead of Post http?
