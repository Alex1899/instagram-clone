const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../model/postSchema");
const Comments = require("../model/commentSchema");
const Grid = require("gridfs-stream");
const upload = require("../middleware/upload");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const { assert } = require("console");

// gridfs stream to fetch images
const connect = mongoose.createConnection(process.env.MONGODB_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

let gfs;

connect.once("open", () => {
  console.log("gfs initialized");
  gfs = new mongoose.mongo.GridFSBucket(connect.db, { bucketName: "photos" });
});

router.post("/", async function (req, res, next) {
  console.log(req.body);

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send({ msg: "Empty request" });
  }
  let posts = await Post.find({ userId });
  if (posts.length == 0) return res.send({ posts });
  posts = posts.reverse();

  res.send({ posts });
});

router.post("/create", async function (req, res, next) {
  try {
    console.log("post data, ", req.body);
    const { userId, caption } = req.body;
    console.log("file name => ", req.files.file.name);
    console.log("file temp path => ", req.files.file.tempFilePath);
    if (!userId) return res.status(400).send({ msg: "User id not supplied" });

    // upload image to db

    if (!req.files) {
      console.log("File not selected");
      return res.send({ msg: "File not selected!" });
    }
    console.log("output => ", req.files);

    let filename = crypto.randomBytes(16).toString("hex") + path.extname(req.files.file.name);

    const readStream = fs.createReadStream(req.files.file.tempFilePath);
    const uploadStream = gfs.openUploadStream(filename);

    let newPostId;

    uploadStream.once('finish', async ()=>{
      
      // image src
      const imageId = "/api/posts/image/".concat(filename);
      // make code below work!!!
      // const imageId = 'data:image/' + path.extname(filename)
      
      const post = new Post({
        userId,
        imageId,
        caption,
        userLikedList: [],
        comments: [],
      });
      const savedPost = await post.save();
      console.log("saved post => ", savedPost);
      newPostId = savedPost._id;
    })

    readStream.pipe(uploadStream);
    res.send({ postId: newPostId });


     


    // save post in db
    // Post.collection.dropIndexes((err, result) => {
    //     console.log(result);
    // });
    // return

    
    
  } catch (e) {
    console.log("Error", e);
  }
});

router.post("/comment", async function (req, res, next) {
  try {
    console.log("post data", req.body);
    const { postId, comment, username } = req.body;
    console.log(comment);
    console.log(comment.toString());
    const post = await Post.findOne({ _id: postId });

    if (!post)
      return res.status(500).send({ msg: "Error when updating post comments" });

    console.log("comments ", post.comments);

    post.comments = [
      ...post.comments,
      {
        text: comment,
        username: username,
      },
    ];

    await post.save();
    res.send({ comments: post.comments });
  } catch (e) {
    console.log("Error", e);
  }
});

router.post("/like", async function (req, res, next) {
  try {
    console.log("post data", req.body);
    const { postId, id, incrementCount } = req.body;
    const post = await Post.findOne({ _id: postId });
    if (!post)
      return res.status(500).send({ msg: "Error when updating post comments" });

    if (incrementCount) {
      post.userLikedList = [...post.userLikedList, id];
    } else {
      post.userLikedList = post.userLikedList.filter((userId) => userId !== id);
    }

    await post.save();
    res.send({
      likesCount: post.userLikedList.length,
      userLikedList: post.userLikedList,
    });
  } catch (e) {
    console.log("Error", e);
  }
});

router.delete("/delete/:postId", async function (req, res, next) {
  console.log(req.params);
  const { postId } = req.params;
  const result = await Post.findByIdAndDelete(postId);
  if (!result) return res.send({ msg: "Post does not exist with this id" });

  console.log("deleted: ", result);
  res.send({ msg: "Successfuly deleted post" });
});

router.get("/image/:filename", (req, res) => {
  console.log('image name', req.params.filename);
  const downloadStream = gfs.openDownloadStreamByName(req.params.filename);
  downloadStream.pipe(res);
});

module.exports = router;
