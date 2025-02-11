const TopSearchedMovies = require('../../models/moview/topSearchedMoviesModel');

exports.getAllTopMovies = async(req, res) => {
    try {        
        const movies = await TopSearchedMovies.find({ is_deleted: false }).sort({ _id: -1 }); // Sort by `_id` in descending order
        res.status(200).json({ status: 'success', results: movies.length, data: { movies } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve movies.' });
    }
};

