const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Show = require('./showModel');

const topSearchedShowsSchema = new Schema({
    show: {
        type: Schema.Types.ObjectId,
        ref: 'Show',
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

const TopSearchedShows = mongoose.models.TopSearchedShows || mongoose.model('TopSearchedShows', topSearchedShowsSchema);
module.exports = TopSearchedShows;
