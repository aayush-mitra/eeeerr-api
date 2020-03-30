const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
const Video = require('../../models/Video');
const keys = require("../../config/keys");
const fileUpload = require('express-fileupload');
const path = require('path');
const fetch = require('node-fetch');

router.get('/test', (req, res) => {
  return res.json({ test: true });
});

router.post('/upload', (req, res) => {
  const {

    title,
    creator,
    description
  } = req.body;

  if (req.files === null) {
    return res.json({ msg: 'No file uploaded' });
  }
  console.log(req.body);

  let file1 = req.files.file1;
  let file2 = req.files.file2;
  let mim1 = path.extname(file1.name);
  let mim2 = path.extname(file2.name);
  file1.name = title + mim1
  file2.name = title + mim2

  file1.mv(`${__dirname}../../../public/uploads/${file1.name}`, err => {
    if (err) {
      console.log(err);
    }
    file2.mv(`${__dirname}../../../public/uploads/${file2.name}`, err => {

      const newVideo = new Video({
        vid: file1.name,
        thumbnail: file2.name,
        title,
        creator,
        description
      });

      newVideo.save((err) => {
        Video.findOne({ title: title }).populate('creator').exec((err, video) => {
          if (err) {
            console.log(err);
          }
          video.save((err, vid) => {
            User.findOne({ _id: vid.creator }, (err, user) => {
              console.log(user);
              user.videos.push(vid._id);
              user.save();
              return res.json({ the_vid: vid });
            });


          });

        });
      });

    });




  });


});


router.post('/like', (req, res) => {
  const {
    userid,
    videoid
  } = req.body;

  Video.findOne({ _id: videoid }, (err, video) => {
    video.likes.push(userid);
    video.save();
    return res.json({ success: true, like_added: video });
  });
});

router.get('/all', (req, res) => {
  Video.find({}, (err, videos) => {
    fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({elems: videos})
    })
      .then(res => res.json())
      .then(json => {
        return res.json({ videos: json.res });
      })

  });
});

router.get('/search', (req, res) => {
  const {
    q
  } = req.query;

  Video.find({}, (err, videos) => {
    fetch('http://localhost:5000/search', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query: q, elems: videos})
    })
    .then(res => res.json())
    .then(json => {
      return res.json({videos: json.res});
    })
  });

});

router.get('/one', (req, res) => {
  Video.findOne({ _id: req.query.id }).populate('comments').exec((err, video) => {
    if (err) {
      return res.json({
        success: false,
        message: 'No Video Found'
      });
    }

    if (!video) {
      return res.json({
        success: false,
        message: 'No Video Found'
      });
    } else {
      return res.json({
        success: true,
        video: video
      });
    }
  });
});



module.exports = router;