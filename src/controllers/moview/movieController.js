const Movie = require('../../models/moview/movieModel');
const Review = require('../../models/moview/reviewModel');

exports.getAllMovies = async(req, res) => {
    try {
        // const movies = await Movie.find({});
        const movies = await Movie.find({ is_deleted: false }).sort({ _id: -1 }); // Sort by `_id` in descending order
        res.status(200).json({ status: 'success', results: movies.length, data: { movies } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve movies.' });
    }
};

// exports.getTopRatedMovies = async (req, res) => {
//     try {
//         // Fetch all movies that are not deleted
//         const movies = await Movie.find({ is_deleted: false });

//         // Aggregate reviews to get average rating and review count for each movie
//         const movieRatings = await Review.aggregate([
//             {$group: {_id: "$movie",avgRating: { $avg: "$rating" },reviewCount: { $sum: 1 }}},
//             {
//                 $sort: { avgRating: -1, reviewCount: -1 } // Sort by highest rating, then by review count
//             }
//         ]);

//         // Map movie details with ratings and review counts
//         const sortedMovies = movieRatings.map(movie => {
//                 const movieDetails = movies.find(m => m._id.toString() === movie._id.toString());
//                 if (!movieDetails) return null; // Ignore movies not found in the Movie collection
//                 return { _id: movieDetails._id, title: movieDetails.title, poster_url: movieDetails.poster_url, avgRating: movie.avgRating, reviewCount: movie.reviewCount,  language: movieDetails.language};
//             })
//             .filter(movie => movie !== null); // Remove any null entries

//         res.status(200).json({status: "success",results: sortedMovies.length, data: { movies: sortedMovies }});

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: "error", message: "Server error: Cannot retrieve movies." });
//     }
// };

exports.getTopRatedMovies = async (req, res) => {
    try {
        // Aggregate reviews to get average rating and review count for each movie
        const movieRatings = await Review.aggregate([
            {
                $group: {
                    _id: "$movie",
                    avgRating: { $avg: "$rating" }, // Calculate average rating
                    reviewCount: { $sum: 1 } // Count number of reviews
                }
            },
            {
                $sort: { avgRating: -1, reviewCount: -1 } // Sort by highest rating, then by review count
            }
        ]);

        // Extract movie IDs from the aggregated ratings
        const movieIds = movieRatings.map(rating => rating._id);

        // Fetch all movie details for the sorted list
        const movies = await Movie.find({ _id: { $in: movieIds }, is_deleted: false });

        // Merge rating data with all movie properties
        const topRatedMovies = movieRatings.map(rating => {
            const movieDetails = movies.find(movie => movie._id.toString() === rating._id.toString());
            if (!movieDetails) return null;

            return {
                ...movieDetails.toObject(), // Spread all movie properties
                avgRating: rating.avgRating,
                reviewCount: rating.reviewCount
            };
        }).filter(movie => movie !== null); // Remove null values

        res.status(200).json({
            status: "success",
            results: topRatedMovies.length,
            data: { movies: topRatedMovies }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error: Cannot retrieve movies." });
    }
};


exports.searchMovies = async(req, res) => {
    const { keyword } = req.body;

    if (!keyword) {
        return res.status(400).json({ status: 'error', message: 'Please provide a search keyword.' });
    }

    try {
        // Use a case-insensitive regex to find movies with the keyword in title or description
        const movies = await Movie.find({ $or: [{ title: { $regex: keyword, $options: 'i' } }] });
        res.status(200).json({ status: 'success', results: movies.length, data: { movies } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot search movies.' });
    }
};


exports.getMovieById = async(req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ status: 'fail', message: 'No movie found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { movie } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve the movie.' });
    }
};

exports.createMovie = async(req, res) => {
    try {
        const newMovie = await Movie.create(req.body);
        res.status(201).json({ status: 'success', data: { movie: newMovie } });
    } catch (error) {
        console.log('Error : ', error);
        return res.status(500).json({ status: 'error', message: `${error} Server error: Cannot create the movie.` });
    }
};

exports.updateMovieById = async(req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) {
            return res.status(404).json({ status: 'fail', message: 'No movie found with that ID' });
        }
        return res.status(200).json({ status: 'success', data: { movie }, message: 'movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot update the movie.' });
    }
};

exports.deleteMovieById = async(req, res) => {
    try {
        const movie = await Movie.findOneAndUpdate({ _id: req.params.id }, { $set: { is_deleted: true } }, { new: true });
        if (!movie) {
            return res.status(404).json({ status: 'fail', message: 'No movie found with that ID' });
        }
        return res.status(200).json({ status: 'success', data: null, message: 'movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot delete the movie.' });
    }
};

exports.getMoviesByGenre = async(req, res) => {
    try {
        const { genre } = req.body;
        if (!genre) {
            return res.status(400).json({ message: "Genre is required" });
        }
        const movies = await Movie.find({
            genre: { $regex: new RegExp(`\\b${genre}\\b`, 'i') }, // Match whole word
            is_deleted: false
        });

        if (movies.length === 0) {
            return res.status(200).json({ message: "No movies found for this genre" });
        }

        res.status(200).json({ status: 'success', results: movies.length, data: { movies } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};