import logo from './logo.svg';
import './App.css';
import Homepage from './Homepage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShowVideo from './Home/showvideos';
import Search  from './Home/search';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import { AuthProvider } from './Authentication/Authcontext';
import LikedVideos from './Home/LikedVideos';
import WatchLater from './Home/watchLater';

function App() {
  return (
    <AuthProvider>
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/show-video/:id" element={<ShowVideo />} />
        <Route path = "/search" element = {<Search />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/signup" element = {<Signup />} />
        <Route path = "/liked-videos" element = {<LikedVideos />} />
        <Route path = "/watch-later" element = {<WatchLater />} />
      </Routes>
    </div>
  </Router>
  </AuthProvider> 
  );
}

export default App;
