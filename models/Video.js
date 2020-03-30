const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  vid: {
    type: String

  },
  thumbnail: {
    type: String
  },
  
  title: {
    type: String,
    required: true
  },
  creator: {
    
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
    
  },
  uploaded: {
    type: Date,
    default: Date.now(),
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  ],
  
  description: {
    type: String,
    required: true
  },

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comments'
    }
  ]



});

module.exports = Video = mongoose.model("videos", VideoSchema);