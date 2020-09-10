var express = require('express');
var router = express.Router();
const Post = require('../model/postSchema');
const Comments = require('../model/commentSchema');


router.get('/', async function(req, res, next){
    console.log('handling get req...')
    let posts = await Post.find();
    if (!posts)
        return res.status(500).send({msg: 'No posts in the database'});

    posts = posts.reverse();
    res.send({ posts });
})



router.post('/create', async function(req, res, next){
    try{
        console.log('post data, ', req.body);

        const { userId, caption, imageUrl } = req.body;
        // save post in db
        // Post.collection.dropIndexes((err, result) => {
        //     console.log(result);
        // });
        // return

        if (!userId)
            return res.status(400).send({msg: 'User id not supplied'})
        
        const post = new Post({ userId, caption, imageUrl, userLikedList: [], comments: [] });
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
        const post = await Post.findOne({ _id: postId });
              
        if(!post)
           return res.status(500).send({msg: 'Error when updating post comments'});
        
        
        console.log('comments ', post.comments);

        post.comments = [
            ...post.comments,{
            text: comment,
            username:username,
        }];

        await post.save();
        res.send({comments: post.comments});
       

    }catch(e){
        console.log('Error', e);
    }
});


router.post('/like', async function(req, res, next){
    try{

        console.log('post data', req.body);
        const { postId, id, incrementCount } = req.body;
        const post = await Post.findOne({ _id: postId});
        if(!post)
           return res.status(500).send({msg: 'Error when updating post comments'});
        
        if(incrementCount){
            post.userLikedList = [
                ...post.userLikedList,
                id, 
            ];  
        }else {
            post.userLikedList = post.userLikedList.filter(userId => userId !== id);
        }
            

        await post.save();
        res.send({ likesCount: post.userLikedList.length, userLikedList: post.userLikedList});

    }catch(e){
        console.log('Error', e);
    }
})


router.delete("/delete/:postId", async function(req, res, next) {
    console.log(req.params);
    const { postId } = req.params;
    const result = await Post.findByIdAndDelete(postId);
    if (!result)
        return res.send({msg: "Post does not exist with this id"});

    console.log("deleted: ", result);
    res.send({msg: "Successfuly deleted post"});
})

module.exports = router;