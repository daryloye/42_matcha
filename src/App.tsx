import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Auth/Login';
import NewPassword from './pages/Auth/NewPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import SignUp from './pages/Auth/SignUp';
import Account from './pages/Home/Account';
import Chat from './pages/Home/Chat';
import Dashboard from './pages/Home/Dashboard';
import Profile from './pages/Home/Profile';
import NotFoundPage from './pages/NotFoundPage';

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
