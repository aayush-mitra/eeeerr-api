const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
const Video = require('../../models/Video');
const Comment = require('../../models/Comment');
const keys = require("../../config/keys");

router.get('/test', (req, res) => res.json({hi: "yo"}));

router.post('/comment', (req, res) => {
  const {
    videoid,
    creatorid,
    content
  } = req.body;

  let username;
  User.findOne({_id: creatorid}, (err, user) => {
    username = user.name;
    
    Video.findOne({_id: videoid}, (err, video) => {

      const newComment = new Comment({
        video: videoid,
        username,
        creatorid,
        content
      });

      newComment.save((err, comment) => {
        video.comments.push(comment._id);
        video.save();
        return res.json({success: true, comment: comment});
      });

    });
  });
})

module.exports = router;