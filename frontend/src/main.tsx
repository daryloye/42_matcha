import { Provider } from 'jotai';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';
import Login from './pages/auth/Login';
import NewPassword from './pages/auth/NewPassword';
import ResetPassword from './pages/auth/ResetPassword';
import SignUp from './pages/auth/SignUp';
import Account from './pages/home/Account';
import Chat from './pages/home/Chat';
import Dashboard from './pages/home/Dashboard';
import Profile from './pages/home/Profile';
import NotFoundPage from './pages/notFound/NotFoundPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path='/newpassword' element={<NewPassword />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/account' element={<Account />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
);
