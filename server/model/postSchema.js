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
}, { timestamps: true});



const Post = mongoose.model('Posts', postSchema);

module.exports = Post;