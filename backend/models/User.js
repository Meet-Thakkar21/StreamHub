const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Define _id as a string
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Unique email field
  password: { type: String, required: true },
  age: { type: Number, required: false }, // Age field (optional)
  gender: { type: String, required: false } // Gender field (optional)
});

// Create the model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
