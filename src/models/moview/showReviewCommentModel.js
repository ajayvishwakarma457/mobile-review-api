const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Movie = require('./movieModel');
const User = require('./userModel');
const ReviewShow = require('./reviewShowModel');

const showReviewCommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    review: {
        type: Schema.Types.ObjectId,
        ref: 'ReviewShow', // Reference to Review model
        required: true
    },
    text: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const ShowReviewComment = mongoose.model.ShowReviewComment || mongoose.model('ShowReviewComment', showReviewCommentSchema);
module.exports = ShowReviewComment;
