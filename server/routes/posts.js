const express = require("express");
const router = express.Router();
const postsController = require('../controllers/postsController');

router.get("/:userId", postsController.getAllUserPosts);
router.post("/create", postsController.createPost);
router.post("/comment", postsController.commentOnPost);
router.put("/like/:postId", postsController.likePost);
router.delete("/delete/:postId", postsController.deletePost);

module.exports = router;
