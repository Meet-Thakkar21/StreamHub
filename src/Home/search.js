import React, { useState, useEffect } from "react";
import Sidebar from "../navbar/sidebar";
import Navbar from "../navbar/navbar";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaUser } from 'react-icons/fa';
import axios from "axios";
import './search.css';

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q'); // Extract 'q' parameter from query string
  
  const [tags, setTags] = useState([]);
  const [videos, setVideos] = useState([]);
  // const[users,setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [allUsers,setAllUsers] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (query) {
          // Fetch tags based on the query
          const tagsResponse = await axios.get(`http://localhost:5000/api/tags/${query}`);
          const tagsData = tagsResponse.data;
          setTags(tagsData);
          console.log(tagsData);
          if (tagsData.length === 0) {
            setError('No tags found');
            return;
          }

          // Assuming tagsData is an array of tags, each with a video field
          const videoIds = tagsData.map(tag => tag.video);
          console.log(videoIds)
          // Fetch all videos related to these tags
          const videoPromises = videoIds.map(videoId => axios.get(`http://localhost:5000/api/videos/${videoId}`));
          const videoResponses = await Promise.all(videoPromises);
          const videosData = videoResponses.map(response => response.data);

          console.log(videosData);
          if (videosData.length === 0) {
            setError('No videos found');
          } else {
            setVideos(videosData);
          }
          const userResponse = await axios.get(`http://localhost:5000/api/user`);
          setAllUsers(userResponse.data);
          
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchVideos();
  }, [query]);


  const userMap = allUsers.reduce((acc, user) => {
    acc[user._id] = user.name; 
    return acc;
  }, {});

  return (
    <div className="searchcomp">
      <div className="Navcomp"><Navbar /></div>
      
      <div className="sideComp"><Sidebar /></div>
      
      <div className="search-results">
        {error && <p>{error}</p>}
        <h1>Search Results for: {query}</h1>
        <div className="video-list-search">
          {videos.length > 0 ? (
            videos.map(video => (
              <Link to={`/show-video/${video._id}`} key={video._id} className="video-card-search">
                <div className="video-thumbnail-search">
                  <img src={`https://via.placeholder.com/300x200?text=${video.title}`} alt={video.title} />          
                </div>
                <div className="video-info-search">
                  <h3>{video.title || 'No Title'}</h3>
                  <p>{video.description || 'No Description'}</p>
                  <p><FaThumbsUp /> {video.likes || 0}</p>
                  <p><FaThumbsDown /> {video.dislike || 0}</p>
                  <p><FaUser /> {userMap[video.createdby] || 'Unknown'}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>No videos found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
