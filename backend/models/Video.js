const mongoose = require('mongoose');

// Define the video schema
const videoSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Use String for _id as per your schema
  content: { type: String, required: true }, // URL to the video content
  title: { type: String, required: true },
  description: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 }, // Note: Field name is "dislike"
  thumbnail: { type: String }, // URL to the video thumbnail
  createdby: { type: String, required: true }, // User ID or username
  numberOfViews: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  watchTime: { type: Number, default: 0 }
});

// Create the model using the schema
module.exports = mongoose.model('Video', videoSchema);
