const TopSearchedMovies = require('../../models/moview/topSearchedShowsModel');

exports.getAllTopShows = async(req, res) => {
    try {        
        const shows = await TopSearchedMovies.find({ is_deleted: false }).sort({ _id: -1 }); // Sort by `_id` in descending order
        res.status(200).json({ status: 'success', results: movies.length, data: { shows } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve movies.' });
    }
};

