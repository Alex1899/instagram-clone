const mongoose = require('mongoose');



const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },

    caption: {
        type: String,
        required: true,
    },

    likeCount: {
        type: Number,
        required: true,
    },

    imageUrl: {
        type: String,
        required: true,
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
    }
}, { timestamps: true});



const Post = mongoose.model('Posts', postSchema);

module.exports = Post;