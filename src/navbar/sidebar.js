  // src/components/Sidebar/Sidebar.js
  import React from 'react';
  import './sidebar.css';
  import { FaHome, FaVideo, FaRegClock, FaHeart, FaList, FaPlay, FaUserCircle } from 'react-icons/fa';

  const Sidebar = () => {
    return (
      <nav className="sidebar">
        <div className="navbar-brand">StreamHub</div>
        <div className="navbar-links">
          <a href="/"><FaHome className="icon" /> Home</a>
          <a href="/subscriptions"><FaVideo className="icon" /> Subscriptions</a>
          <a href="/your-channel"><FaUserCircle className="icon" /> Your Channel</a>
          <a href="/playlists"><FaList className="icon" /> Playlists</a>
          <a href="/your-videos"><FaPlay className="icon" /> Your Videos</a>
          <a href="/liked-videos"><FaHeart className="icon" /> Liked Videos</a>
          <a href="/watch-later"><FaRegClock className="icon" /> Watch Later</a>
        </div>
      </nav>
    );
  };

  export default Sidebar;
