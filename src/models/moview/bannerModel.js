const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
    trending_banner: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["movie", "show"], // Restricts the type to either "movie" or "show"
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie", // Reference to the Movie model
        default: null
    },
    show: {
        type: Schema.Types.ObjectId,
        ref: "Show", // Reference to the Show model
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
module.exports = Banner;
