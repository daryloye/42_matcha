import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import Profile from './pages/Account/Profile';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home/Home';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}
