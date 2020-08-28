var express = require('express');
var router = express.Router();
const Post = require('../model/postSchema');
const Comments = require('../model/commentSchema');


router.post('/create-post', async function(req, res, next){
    try{
        console.log('post data, ', req.body);

        const { userId, caption, imageUrl } = req.body;
        // save post in db
        const post = new Post({ userId, caption, imageUrl, likeCount: 0 });
        await post.save();
        
        // create comments section for post in db
        // consider initializing with empty comments section
        const comment = new Comment({ postId })
    }catch(e){
        console.log('Error', e);
    }
});

router.post('/comment', async function(req, res, next){
    try{
        console.log('post data', req.body);
        const { postId, comment, username } = req.body;
        const comments = await Comments.update({ postId }, {
            $set:{
                "comments.text":{
                    comment,
                },
                "comment.username": {
                    username,
                }
            }
        });

        if(!comments)
            return res.status(500).send({msg: 'Error when updating the comment of a post'})
        
        res.send({comments: comments.comments});

    }catch(e){
        console.log('Error', e);
    }
})