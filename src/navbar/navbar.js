import React from 'react';
import { FaSearch,FaSignOutAlt, FaUserCircle, FaMoon, FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../Authentication/Authcontext';
import './navbar.css';

const NavbarComponent = () => {
  const { isLoggedIn, logout } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChanges = (event) => {
    setSearchQuery(event.target.value);
  }

  return (
    <div className="ctn">
      <div className="bar">
        <div className="search-bar">
          <input
            type="text"
            className="search"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChanges}
          />
          <Link to={`/search?q=${searchQuery}`} className='searchroute'>
            <div className="sicon"><FaSearch /></div>
          </Link>
        </div>
        <div className="btngrp">
          {isLoggedIn ? (
            <>
              <Link to="/upload" className="nav-btn upload-btn">Upload</Link>
              <button className="icon-button" onClick={logout}>
              <FaSignOutAlt />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn login-btn">Login</Link>
              <Link to="/signup" className="nav-btn signup-btn">Signup</Link>
            </>
          )}
          <button className="icon-button"><FaMoon /></button>
        </div>
      </div>
    </div>
  );
};

export default NavbarComponent;
