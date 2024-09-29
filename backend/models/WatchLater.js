const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WatchLaterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  video: {type: String, required: true},
  user: {type: String, required: true}
});


const Watchlater = mongoose.model('watch_later', WatchLaterSchema);

module.exports = Watchlater;