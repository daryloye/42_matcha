// Filename - App.js

import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
import Profile from './pages/Profile/Profile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;