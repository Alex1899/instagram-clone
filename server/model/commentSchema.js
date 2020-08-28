const mongoose = require('mongoose');



const commentsSchema = mongoose.Schema({
    postId: {
        type: String,
        required: true,
        unique: true,
    },

    comments: {
        type: [{
            text: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true,
            }
        }],
    }
}, { timestamps: true});



const Comments = mongoose.model('Comments', commentssSchema);

module.exports = Comments;