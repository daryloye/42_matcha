// Filename - App.js

import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from './Home';
import Login from './Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;