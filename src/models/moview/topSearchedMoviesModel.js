const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Movie = require('./movieModel');

const topSearchedMoviesSchema = new Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    search_count: {
        type: Number,
        default: 1
    },
    last_searched_at: {
        type: Date,
        default: Date.now
    }
});

const TopSearchedMovies = mongoose.models.TopSearchedMovies || mongoose.model('TopSearchedMovies', topSearchedMoviesSchema);
module.exports = TopSearchedMovies;
