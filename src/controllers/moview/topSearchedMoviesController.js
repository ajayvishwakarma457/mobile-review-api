const TopSearchedMovies = require('../../models/moview/topSearchedMoviesModel');

exports.AddTopMovie = async (req, res) => {
    try {
        const { movieId } = req.body;
        if (!movieId) {
            return res.status(400).json({ status: 'error', message: 'Movie ID is required.' });
        }

        let topSearchedMovie = await TopSearchedMovies.findOne({ movie: movieId });

        if (topSearchedMovie) {
            topSearchedMovie.search_count += 1;
            topSearchedMovie.last_searched_at = Date.now();
        } else {
            topSearchedMovie = new TopSearchedMovies({ movie: movieId, search_count: 1 });
        }

        await topSearchedMovie.save();
        res.status(201).json({ status: 'success', data: { topSearchedMovie } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot add movie.' });
    }
}

exports.getAllTopMovies = async (req, res) => {
    try {
        const movies = await TopSearchedMovies.find().sort({ search_count: -1 }).populate('movie');        
        res.status(200).json({ status: 'success', results: movies.length, data: { movies } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve movies.' });
    }
};

