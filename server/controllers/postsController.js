const Post = require("../model/postSchema");
const { clearHash, addNewPostToHash, updatePostLikesInCache, deletePostInCache } = require("../services/cache");


module.exports.getAllUserPosts = async function (req, res, next) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({ msg: "Empty request" });
  }
  let posts = await Post.find({ userId }).cache({ mode: "useCache" });
  if (posts.length == 0) {
    console.log("There are no user posts in the db...");
    return res.send({ posts });
  }
  posts = posts.reverse();

  res.send({ posts });
};

module.exports.createPost = async function (req, res, next) {
  try {
    const { userId, caption, file } = req.body;
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

    newPostId = savedPost._id;
    res.send({ postId: newPostId });
  } catch (e) {
    console.log("Error", e);
  }
};

module.exports.commentOnPost = async function (req, res, next) {
  try {
    console.log("post data", req.body);
    const { postId, comment, username } = req.body;
    console.log(comment);
    console.log(comment.toString());
    const post = await Post.findOne({ _id: postId });
    let comments;

    if (!post)
      return res.status(500).send({ msg: "Error when updating post comments" });

    console.log("comments ", post.comments);

    comments = [
      ...post.comments,
      {
        text: comment,
        username: username,
      },
    ];

    await post.updateOne({ comments });
    res.send({ comments });
  } catch (e) {
    console.log("Error", e);
  }
};

module.exports.likePost = async function (req, res, next) {
  try {
    console.log("post data", req.body);
    const { postId } = req.params;
    const { id, incrementCount } = req.body;
    const post = await Post.findOne({ _id: postId });
    let userLikedList;
    if (!post)
      return res.status(500).send({ msg: "Error when updating post comments" });

    if (incrementCount) {
      userLikedList = [...post.userLikedList, id];
    } else {
      userLikedList = post.userLikedList.filter((userId) => userId !== id);
    }

    await post.updateOne({ userLikedList });
    // update cache
    updatePostLikesInCache(postId, userLikedList, Post.collection.collectionName);
    res.send({
      likesCount: userLikedList.length,
      userLikedList,
    });
  } catch (e) {
    console.log("Error", e);
  }
};

module.exports.deletePost = async function (req, res, next) {
  console.log(req.params);
  const { postId } = req.params;
  const result = await Post.findByIdAndDelete(postId).cache();
  if (!result) return res.send({ msg: "Post does not exist with this id" });

  deletePostInCache(postId, Post.collection.collectionName);

  // console.log("deleted: ", result);
  res.send({ msg: "Successfuly deleted post" });
};
