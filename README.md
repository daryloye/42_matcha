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
make prune
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
