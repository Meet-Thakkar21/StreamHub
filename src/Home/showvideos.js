import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaThumbsUp, FaCommentDots, FaShareAlt, FaPlus } from 'react-icons/fa';
import './showvideo.css'; 
import NavbarComponent from '../navbar/navbar'; 
import Sidebar from '../navbar/sidebar'; 
import MenuIcon from '@mui/icons-material/Menu';
import VideoPlayer from './videoplayer';
import { useRef } from 'react';
import videojs from 'video.js';
import { useAuth } from '../Authentication/Authcontext';
import { BsStopwatch } from "react-icons/bs";

const ShowVideo = () => {
  const { id } = useParams();
  const { currentUser } = useAuth(); 
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  var sidebarVisible = true;
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const playerRef = useRef(null);
  const [isWatchLater, setIsWatchLater] = useState(false);

  const setSidebarVisible = (visible) => {
    sidebarVisible = visible;
  }
  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: 'http://localhost:5000/uploads/courses/83ee8be1-8946-4cf0-a70b-86ebec9822bb/index.m3u8',
        type: 'application/x-mpegURL',
      },
    ],
  };

  const handlePlayerReady = (Player) => {
    playerRef.current = Player;

    Player.on('waiting', () => {
      videojs.log('player is waiting');
    });
    Player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  useEffect(() => {    
    const fetchData = async () => {
      try {
        setLoading(true);
        setIsLiked(false);
        setIsWatchLater(false);
        const videoResponse = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(videoResponse.data);

        const videosResponse = await axios.get('http://localhost:5000/api/videos');
        setVideos(videosResponse.data);

        const userResponse = await axios.get(`http://localhost:5000/api/user/${videoResponse.data.createdby}`);
        setUser(userResponse.data);

        // Check if the current user has liked the video
       
        if (currentUser) {
          const likedResponse = await axios.get(`http://localhost:5000/api/liked-videos/${id}/${currentUser._id}`);
          if (likedResponse.data) {
            setIsLiked(true);
          }

          const watchLaterResponse = await axios.get(`http://localhost:5000/api/watch_later/${id}/${currentUser._id}`);
          if(watchLaterResponse.data){
            setIsWatchLater(true);
          }
        }


        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar-video');
    if (sidebar.style.display === 'block') {
      sidebar.style.display = 'none';
      setSidebarVisible(false);
    } else {
      sidebar.style.display = 'block';
      setSidebarVisible(true);
    }
  };

  const handleLikeToggle = async () => {
    try {
      if (!currentUser) {
        alert('You need to be logged in to like the video');
        return;
      }

      if (isLiked) {
        await axios.delete(`http://localhost:5000/api/liked-videos/${id}/${currentUser._id}`);
        setIsLiked(false);
      } else {
        await axios.post('http://localhost:5000/api/liked-videos', {
          video: id,
          likedby: currentUser._id,
        });
        setIsLiked(true);
      }
    } catch (err) {
      console.log('Error toggling like status:', err);
    }
  };


  const handleWatchLaterToggle = async() => {
    try{
      if (!currentUser) {
        alert('You need to be logged in to add the video into Watch Later');
        return;
      }

      if(isWatchLater){
        await axios.delete(`http://localhost:5000/api/watch_later/${id}/${currentUser._id}`);
        setIsWatchLater(false);
      }else {
        await axios.post('http://localhost:5000/api/watch_later', {
          video: id,
          user: currentUser._id,
        });
        setIsWatchLater(true);
      }
    }catch(err){

    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div className="show-video-page">
      <NavbarComponent />
      <div className='sidebar-video'>
        {sidebarVisible && <Sidebar />}
      </div>
      <div className={`show-video-content ${sidebarVisible ? 'sidebar-visible' : ''}`}>
        <div className="video-player">
          <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
          <div className="video-details">
            <div className='analytics'>
              <p className='publish-user'><b><FaUser /> Published by:</b> {user ? user.name : 'Loading...'}</p>
            </div>
            <div className="social-buttons">
              <button 
                className={`social-button liked ${isLiked ? 'active' : ''}`} 
                onClick={handleLikeToggle}
              >
                <FaThumbsUp /> {isLiked ? 'Unlike' : 'Like'}
              </button>
              <button className="social-button"><FaCommentDots /> Comment</button>
              <button className={`social-button watchlater ${isWatchLater ? 'active' : ''}`}
              onClick={handleWatchLaterToggle}><BsStopwatch />Watch Later</button>
              <button className="social-button"><FaShareAlt /> Share</button>
              <button className="social-button"><FaPlus /> Follow Creator</button>
            </div>
          </div>
        </div>
        <div className="recommendations">
          <h2>Recommendations</h2>
          <div className="recommendation-list">
            {videos.filter(v => v._id !== video._id).map(recommendation => (
              <Link to={`/show-video/${recommendation._id}`} key={recommendation._id} className='recommendation-card'>
                <div className="recommendation-card">
                  <div className="recommendation-thumbnail">
                    <img src={`https://via.placeholder.com/150x100?text=${recommendation.title}`} alt={recommendation.title} />
                  </div>
                  <div className="recommendation-info">
                    <h4 className='recom-title'>{recommendation.title}</h4>
                    <p className='recom-desc'>{recommendation.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <button className='togglebtn' onClick={toggleSidebar}>
        <MenuIcon />
      </button>
    </div>
  );
};

export default ShowVideo;
