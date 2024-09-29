import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/navbar';
import Sidebar from '../navbar/sidebar';
import axios from 'axios';
import './likedvideos.css'; // Import the CSS file
import { useAuth } from '../Authentication/Authcontext'; // For getting current user
import { Link } from 'react-router-dom';
function LikedVideos() {
  const [likedVideos, setLikedVideos] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth(); // Get the current user

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/liked-videos/${currentUser._id}`);
        console.log(currentUser._id);
        setLikedVideos(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching liked videos');
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchLikedVideos();
    }
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="liked-videos-page">
      <div className='NavLike'><Navbar /></div>
      <div className="content">
      <Sidebar />
        <div className="liked-videos-section">
          <h1>Liked Videos</h1>
          {likedVideos === null ? ( // Check if likedVideos is null
            <p>You haven't liked any videos yet.</p>
          ) : likedVideos.length > 0 ? ( // Check if there are videos
            <div className="video-grid">
              {likedVideos.map((video) => (
                <Link to={`/show-video/${video._id}`} key={video._id} className="liked-video-card">
                <div key={video._id} className="video-card">
                  <img src={`https://via.placeholder.com/300x180?text=${video.title}`} alt={video.title} />
                  <div className="video-info-liked">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </div>
                </div>
              </Link>
              ))}
            </div>
          ) : (
            <p>You haven't liked any videos yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LikedVideos;
