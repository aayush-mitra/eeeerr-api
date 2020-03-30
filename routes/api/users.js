const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");

router.get("/test", (req, res) => {
  return res.json({ msg: "Holy Moly!!" });
});

router.post("/register", (req, res) => {
  const errors = {};
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists.";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,

      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json({
              success: true,
              message: "Good Job It Worked"
            }))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/signin", (req, res) => {
  const { body } = req;
  const {
    password
  } = body;
  let {
    email
  } = body;

  User.find({
    email: email
  }, (err, users) => {
    if (err) {
      return res.json({
        success: false,
        message: "server error"
      });
    }
    if (users.length != 1) {
      return res.json({
        success: false,
        message: "invalid"
      });
    }

    const user = users[0];
    if (!user.validPassword(password)) {
      return res.json({
        success: false,
        message: "invalid password"
      });
    }

    const userSession = new UserSession();
    userSession.userId = user._id;
    userSession.save((err, doc) => {
      if (err) {
        return res.json({
          success: false,
          message: "server error"
        });
      }

      return res.json({
        success: true,
        message: "valid",
        token: doc._id
      });
    });
  });
});

router.get("/verify", (req, res) => {
  const { query } = req;
  const { token } = query;

  UserSession.find({
    _id: token,
    isDeleted: false
  }, (err, sessions) => {
    if (err) {
      return res.json({
        success: false,
        message: "Error: Internal server error"
      });
    }

    if (sessions.length !== 1) {
      return res.json({
        success: false,
        message: "Error: invalid"
      });
    } else {
      return res.json({
        success: true,
        message: "Good"
      });
    }
  });

});

router.get('/logout', (req, res) => {
  const { query } = req;
  const { token } = query;

  UserSession.findOneAndUpdate({
    _id: token,
    isDeleted: false
  }, {
      $set: { isDeleted: true }
    }, null, (err, sessions) => {
      if (err) {

        return res.json({
          success: false,
          message: "Error: Internal server error"
        });
      }

      return res.json({
        success: true,
        message: "Good"
      });

    });
});

router.get('/userdata', (req, res) => {
  const { query } = req;
  const { token } = query;

  UserSession.find({
    _id: token,
    isDeleted: false
  }, (err, sessions) => {
    if (err) {

      return res.json({
        success: false,
        message: "Error: Internal server error"
      });
    }

    if (sessions.length != 1) {
      return res.json({
        success: false,
        message: "Error: Invalid"
      });
    } else {
      const the_session = sessions[0];
      const { userId } = the_session;
      User.find({ _id: userId }, (err, users) => {
        if (err) {
          return res.json({
            success: false,
            message: "error internal"
          });
        }

        if (users.length != 1) {
          return res.json({
            success: false,
            message: "error invalid"
          });
        } else {
          const the_user = users[0];
          return res.json({
            videos: the_user.videos,
            subscribers: the_user.subscribers,
            _id: the_user._id,
            name: the_user.name,
            email: the_user.email
          });
        }
      })

    }
  });
});

router.post('/subscribe', (req, res) => {
  const {
    userid1,
    name
  } = req.body;

  User.findOne({name: name}, (err, user) => {
    user.subscribers.push(userid1);
    user.save();
    return res.json({success: true, subscriber_added: user});
  });
});

router.get('/userdatafromname', (req, res) => {
  const {
    name
  } = req.query;
  //console.log(name);
  User.findOne({name: name}, (err, user) => {
    //console.log(user);
    if (err) {
      return res.json({
        success: false,
        message: 'error'
      });
    } 
    if (!user) {
      return res.json({
        success: false,
        message: 'no user or too many users'
      });
    } else {
      return res.json({success: true, user: {
        videos: user.videos,
        subscribers: user.subscribers,
        _id: user._id,
        name: user.name,
        email: user.email
      }})
    }

  });
});

router.get('/userdatafromid', (req, res) => {
  const {
    id
  } = req.query;

  User.findOne({_id: id}, (err, user) => {
    if (err) {
      return res.json({
        success: false,
        message: err
      });
    }
    if (!user) {
      return res.json({
        success: false,
        message: 'No user found'
      });
    } else {
      
      return res.json({success: true, user: {
        videos: user.videos,
        subscribers: user.subscribers,
        _id: user._id,
        name: user.name,
        email: user.email
      }})
    }
  });
  
});
module.exports = router;