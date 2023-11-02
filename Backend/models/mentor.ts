import mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model("mentor", MentorSchema);