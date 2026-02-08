import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import NewPassword from './features/auth/pages/NewPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import SignUp from './features/auth/pages/SignUp';
import Account from './features/home/pages/Account';
import Chat from './features/home/pages/Chat';
import Dashboard from './features/home/pages/Dashboard';
import Profile from './features/home/pages/Profile';
import NotFoundPage from './features/notFound/NotFoundPage';

export default function App() {
  return (
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
  );
}
