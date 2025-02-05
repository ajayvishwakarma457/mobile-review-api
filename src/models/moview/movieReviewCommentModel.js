const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Movie = require('./movieModel');
const User = require('./userModel');
const Review = require('./reviewModel');

const movieReviewCommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    review: {
        type: Schema.Types.ObjectId,
        ref: 'Review', // Reference to Review model
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

const MovieReviewComment = mongoose.model.MovieReviewComment || mongoose.model('MovieReviewComment', movieReviewCommentSchema);

module.exports = MovieReviewComment;
