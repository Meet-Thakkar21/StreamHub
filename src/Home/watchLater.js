import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/navbar';
import Sidebar from '../navbar/sidebar';
import axios from 'axios';
import { useAuth } from '../Authentication/Authcontext'; 
import { Link } from 'react-router-dom';
import './watchLater.css';
function WatchLater() {
  const [watchLaterVideos, setwatchLaterVideos] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchWatchLaterVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/watch_later/${currentUser._id}`);
        console.log(currentUser._id);
        setwatchLaterVideos(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching liked videos');
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchWatchLaterVideos();
    }
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="watch-videos-page">
      <div className='NavLike'><Navbar /></div>
      <div className="content">
      <Sidebar />
        <div className="watch-videos-section">
          <h1>Watch Now</h1>
          {watchLaterVideos === null ? ( 
            <p>You haven't added any videos to watch later yet.</p>
          ) : watchLaterVideos.length > 0 ? ( 
            <div className="video-grid">
              {watchLaterVideos.map((video) => (
                <Link to={`/show-video/${video._id}`} key={video._id} className="watch-video-card">
                <div key={video._id} className="watch-video-card">
                  <img src={`https://via.placeholder.com/300x180?text=${video.title}`} alt={video.title} />
                  <div className="video-info-watch">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </div>
                </div>
              </Link>
              ))}
            </div>
          ) : (
            <p>You haven't added any videos to watch later yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}


export default WatchLater