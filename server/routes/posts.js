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
const { clearHash, addNewPostToHash } = require("../services/cache");


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

// get all posts of the user
router.get("/:userId", async function (req, res, next) {

  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({ msg: "Empty request" });
  }
  let posts = await Post.find({ userId }).cache({ mode: "useCache" });
  if (posts.length == 0){
    console.log('There are no user posts in the db...');
    return res.send({ posts });

  }
  posts = posts.reverse();

  res.send({ posts });
});

router.post("/create", async function (req, res, next) {
  try {
    // console.log("post data, ", req.body);
    const { userId, caption, file } = req.body;
    // console.log("file name => ", req.files.file.name);
    // console.log("file temp path => ", req.files.file.tempFilePath);
    if (!userId) return res.status(400).send({ msg: "User id not supplied" });

    let newPostId;

    const post = new Post({
      userId,
      imageId: file,
      caption,
      userLikedList: [],
      comments: [],
    });
    const savedPost = await post.save();
    addNewPostToHash(savedPost);

    // console.log("saved post => ", savedPost);
    newPostId = savedPost._id;

    // uploadStream.once('finish', async ()=>{
    //   let src;
    //   if (path.extname(req.files.file.name) === '.jpg'){
    //       src = 'data:image/jpeg;base64,';
    //   }else {
    //     src = 'data:image/png;base64,';
    //   }
     
    //   console.log(src);

    //   const result = fs.readFileSync(req.files.file.tempFilePath);
    //   const imageSrc = src + Buffer.from(result).toString('base64');
    //   console.log('image src =>> ', imageSrc);

    //   const post = new Post({
    //     userId,
    //     imageId: imageSrc,
    //     caption,
    //     userLikedList: [],
    //     comments: [],
    //   });
    //   const savedPost = await post.save();
    //   console.log("saved post => ", savedPost);
    //   newPostId = savedPost._id;
    // })

    //readStream.pipe(uploadStream);
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

router.put("/like/:postId", async function (req, res, next) {
  try {
    console.log("post data", req.body);
    const { postId } = req.params;
    const { id, incrementCount } = req.body;
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
  const result = await Post.findByIdAndDelete(postId).cache({ mode: "editCache", args: { postId }});
  if (!result) return res.send({ msg: "Post does not exist with this id" });

  // console.log("deleted: ", result);
  res.send({ msg: "Successfuly deleted post" });
});

router.get("/image/:filename", (req, res) => {
  console.log('image name', req.params.filename);
  const downloadStream = gfs.openDownloadStreamByName(req.params.filename);
  downloadStream.pipe(res);
});

module.exports = router;
