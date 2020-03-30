const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'videos'
  },
  
  username: {
    type: String
  },

  creatorid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  
  written: {
    type: Date,
    default: Date.now(),
    required: true
  },
  
  content: {
    type: String,
    required: true
  }

});

module.exports = Comment = mongoose.model("comments", CommentSchema);