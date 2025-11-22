import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Home/Dashboard';
import Profile from './pages/Home/Profile';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}
