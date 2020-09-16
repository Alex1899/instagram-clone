const mongoose = require('mongoose');



const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        sparse: true
    },

    imageId: {
        type: String,
        required: true,
    },

    caption: {
        type: String,
    },

    userLikedList: {
        type: [{
            type: String,
            unique: true
        
        }],
        required: true,
        sparse: true,
    },
    
    comments: {
        type: [{
            text: {
                type: String,
            },
            username: {
                type: String,
            }
        }],
        sparse: true
    }
}, { timestamps: true});



const Post = mongoose.model('Posts', postSchema);

module.exports = Post;