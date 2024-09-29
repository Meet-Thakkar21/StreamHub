const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const LikedVideosSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Define _id as a string
  video: {type: String, required: true},
  likedby: {type: String, required: true}
});


const LikedVideos = mongoose.model('liked_videos', LikedVideosSchema);

module.exports = LikedVideos;