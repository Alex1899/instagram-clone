var express = require('express');
var router = express.Router();
const Post = require('../model/postSchema');
const Comments = require('../model/commentSchema');


router.get('/', async function(req, res, next){
    console.log('handling get req...')
    const posts = await Post.find();
    if (!posts)
        return res.status(500).send({msg: 'No posts in the database'});

    res.send({ posts });
})



router.post('/create', async function(req, res, next){
    try{
        console.log('post data, ', req.body);

        const { userId, caption, imageUrl } = req.body;
        // save post in db
        const post = new Post({ userId, caption, imageUrl, likeCount: 0 , comments: { text: '', username: ''}});
        const savedPost = await post.save();
        console.log('saved post => ', savedPost);
        res.send({postId: savedPost._id});
        
    }catch(e){
        console.log('Error', e);
    }
});

router.post('/comment', async function(req, res, next){
    try{
        console.log('post data', req.body);
        const { postId, comment, username } = req.body;
        console.log(comment);
        console.log(comment.toString());
        await Post.updateOne({ _id: postId }, {
            $set:{
                    comments: {
                        text: comment,
                        username:username,
                    }
                }
            
        });
       
        // sends nothing... fix

    }catch(e){
        console.log('Error', e);
    }
})

module.exports = router;