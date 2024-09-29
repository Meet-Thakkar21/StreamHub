const express = require('express');
const router = express.Router();
const LikedVideos = require('../models/LikedVideos');
const Video = require('../models/Video'); // Assuming you have a Video model

// Fetch all liked videos
router.get('/', async (req, res) => {
  try {
    const liked_videos = await LikedVideos.find();
    res.json(liked_videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if a video is already liked by a user
router.get('/:videoId/:userId', async (req, res) => {
  const { videoId, userId } = req.params;
  try {
    const likedVideo = await LikedVideos.findOne({ video: videoId, likedby: userId });
    res.json(likedVideo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a video to liked videos
router.post('/', async (req, res) => {
  const { video, likedby } = req.body;

  try {
    const newLikedVideo = new LikedVideos({ _id: video + likedby, video, likedby });
    await newLikedVideo.save();
    res.status(201).json(newLikedVideo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a liked video by video ID and likedby (user ID)
router.delete('/:videoId/:userId', async (req, res) => {
  const { videoId, userId } = req.params;
  try {
    const result = await LikedVideos.deleteOne({ video: videoId, likedby: userId });
    if (result.deletedCount > 0) {
      res.json({ message: 'Video unliked' });
    } else {
      res.status(404).json({ message: 'Liked video not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:userId', async (req, res) => {
  console.log("In request");
  try {
    const { userId } = req.params;
    // Fetch liked video IDs
    console.log(userId);
    const likedVideos = await LikedVideos.find({ likedby: userId });
    console.log("Hello hi " + likedVideos);
    const videoIds = likedVideos.map((likedVideo) => likedVideo.video);

    // Fetch video details for these IDs
    const videos = await Video.find({ _id: { $in: videoIds } });

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
