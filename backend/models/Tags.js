// models/videoTag.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const videoTagSchema = new Schema({
  video: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  }
});

// Create the model
const Tags = mongoose.model('Tags', videoTagSchema);

module.exports = Tags;
