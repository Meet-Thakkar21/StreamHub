import React, { useState, useEffect } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown, FaUser } from 'react-icons/fa';
import { useAuth } from '../Authentication/Authcontext';
const Home = () => {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  useEffect(() => {
    // Fetch video data from the backend
    axios.get('http://localhost:5000/api/videos')
      .then(response => {
        setVideos(response.data);
        return axios.get('http://localhost:5000/api/user'); // Fetch user data
      })
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        setLoading(false);
      });
    }, []);
    
    console.log(currentUser);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Create a map of user IDs to user names
  const userMap = users.reduce((acc, user) => {
    acc[user._id] = user.name; 
    return acc;
  }, {});
  
  return (
    <div className="home-page">
       {currentUser ? <h2>Welcome, {currentUser.name}!</h2> : <h2>Welcome, Guest!</h2>}
      <div className="video-list">
        {videos.map(video => (
          <Link to={`/show-video/${video._id}`} key={video._id} className="video-card">
            <div className="video-thumbnail">
              <img src={`https://via.placeholder.com/300x200?text=${video.title}`} alt={video.title} />          
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <p><FaThumbsUp /> {video.likes}</p>
              <p><FaThumbsDown /> {video.dislike}</p>
              <p><FaUser /> {userMap[video.createdby] || 'Unknown'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
