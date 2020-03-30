const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const path = require('path');
const fileUpload = require('express-fileupload');

const users = require("./routes/api/users");
const videos = require("./routes/api/videos");
const comments = require("./routes/api/comments");


const app = express();

app.use(fileUpload());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("Mongodb connected\nAdd comment functionality"))
  .catch(err => console.log(err));

let options = {};

app.use(express.static("public", options));

app.use("/api/users", users);
app.use("/api/videos", videos);
app.use("/api/comments", comments);

let port = process.env.PORT || 80;

app.listen(port, () => {
  console.log("Server running on port " + port);
  
});
