const express = require("express");
const router = express.Router();
const WatchLater = require("../models/WatchLater");
const Video = require('../models/Video');

router.get('/', async (req, res) => {
  try {
    const watch_later = await WatchLater.find();
    res.json(watch_later);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:videoId/:userId', async(req,res) => {
  const {videoId, userId} = req.params;
  try {
    const watch_later = await WatchLater.findOne({video: videoId, user: userId});
    res.json(watch_later);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/' , async(req,res) => {
  const {video , user} = req.body;

  try{
    const newWatchLaterVid = new WatchLater({_id: video + user, video, user});
    await newWatchLaterVid.save();
    res.status(201).json(newWatchLaterVid)
  }catch(err){
    res.status(500).json({message: err.message});
  }
});


router.delete('/:videoId/:userId', async(req,res) =>{
  const {videoId, userId} = req.params;
  try{
    const result = await WatchLater.deleteOne({video: videoId, user: userId});
    if(result.deletedCount > 0){
      res.json({message: 'Video removed from watch later'});
    }else{
      res.status(404).json({message: 'Watch later video not found'});
    }
  }catch(err){
    res.status(500).json({message:err.message});
  }
  
});

router.get('/:userId', async (req, res) => {
  console.log("In request");
  try {
    const { userId } = req.params;
    console.log(userId);
    const watchlatervids = await WatchLater.find({user: userId });
    console.log("Hello hi " + watchlatervids);
    const videoIds = watchlatervids.map((watchlatervid) => watchlatervid.video);
    console.log(videoIds);
    // Fetch video details for these IDs
    const videos = await Video.find({ _id: { $in: videoIds } });
    console.log(videos);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;