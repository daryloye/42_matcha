import { Provider } from 'jotai';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import LoginPage from './pages/auth/Login';
import NewPasswordPage from './pages/auth/NewPassword';
import SignUpPage from './pages/auth/SignUp';
import VerifyPage from './pages/auth/Verify';
import Account from './pages/home/Account';
import Chat from './pages/home/Chat';
import Profile from './pages/home/Profile';
import Search from './pages/home/Search';
import NotFoundPage from './pages/notFound/NotFoundPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/resetpassword' element={<ForgotPasswordPage />} />
          <Route path='/newpassword' element={<NewPasswordPage />} />
          <Route path='/search' element={<Search />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/account' element={<Account />} />
          <Route path='/verify' element={<VerifyPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </Provider>
  </StrictMode>,
);
