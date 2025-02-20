const Show = require('../../models/moview/showModel');
const ReviewShow = require('../../models/moview/reviewShowModel');

exports.getAllShows = async(req, res) => {
    try {
        // const shows = await Show.find({});
        const shows = await Show.find({ is_deleted: false }).sort({ _id: -1 }); // Sort by `_id` in descending order
        res.status(200).json({ status: 'success', results: shows.length, data: { shows } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve shows.' });
    }
};

exports.getTopRatedShows = async (req, res) => {
    try {
        const showRatings = await ReviewShow.aggregate([
            {
                $group: {
                    _id: "$show",
                    avgRating: { $avg: "$rating" }, // Calculate the average rating
                    reviewCount: { $sum: 1 } // Count the number of reviews
                }
            },
            {
                $sort: { avgRating: -1, reviewCount: -1 } // Sort by highest rating, then by review count
            }
        ]);

        const showIds = showRatings.map(r => r._id);
        const shows = await Show.find({ _id: { $in: showIds }, is_deleted: false });

        // Map the shows with their respective rating and review count
        const topRatedShows = showRatings.map(rating => {
            const showDetails = shows.find(show => show._id.toString() === rating._id.toString());
            if (!showDetails) return null;

            return {
                _id: showDetails._id,
                title: showDetails.title,
                poster_url: showDetails.poster_url,
                language: showDetails.language,
                avgRating: rating.avgRating,
                reviewCount: rating.reviewCount
            };
        }).filter(show => show !== null); // Remove null values

        res.status(200).json({status: 'success',results: topRatedShows.length,data: { shows:topRatedShows }});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve top-rated shows.' });
    }
};

exports.searchShows = async(req, res) => {
    const { keyword } = req.body;

    if (!keyword) {
        return res.status(400).json({ status: 'error', message: 'Please provide a search keyword.' });
    }

    try {
        // Use a case-insensitive regex to find movies with the keyword in title or description
        const shows = await Show.find({ $or: [{ title: { $regex: keyword, $options: 'i' } }] });
        res.status(200).json({ status: 'success', results: shows.length, data: { shows } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot search shows.' });
    }
};

exports.getShowById = async(req, res) => {
    try {
        const show = await Show.findById(req.params.id);
        if (!show) {
            return res.status(404).json({ status: 'fail', message: 'No show found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { show } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve the show.' });
    }
};

exports.createShow = async(req, res) => {
    try {
        const newShow = await Show.create(req.body);
        res.status(201).json({ status: 'success', data: { show: newShow } });
    } catch (error) {
        console.log('Error : ', error);
        return res.status(500).json({ status: 'error', message: 'Server error: Cannot create the show.' });
    }
};

exports.updateShowById = async(req, res) => {
    try {
        const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!show) {
            return res.status(404).json({ status: 'fail', message: 'No show found with that ID' });
        }
        return res.status(200).json({ status: 'success', data: { show }, message: 'show deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot update the show.' });
    }
};

exports.deleteShowById = async(req, res) => {
    try {
        const show = await Show.findOneAndUpdate({ _id: req.params.id }, { $set: { is_deleted: true } }, { new: true });
        if (!show) {
            return res.status(404).json({ status: 'fail', message: 'No show found with that ID' });
        }
        return res.status(200).json({ status: 'success', data: null, message: 'show deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot delete the show.' });
    }
};



exports.getShowsByGenre = async(req, res) => {
    try {
        const { genre } = req.body;
        if (!genre) {
            return res.status(400).json({ message: "Genre is required" });
        }
        const shows = await Show.find({
            genre: { $regex: new RegExp(`\\b${genre}\\b`, 'i') }, // Match whole word
            is_deleted: false
        });

        if (shows.length === 0) {
            return res.status(200).json({ message: "No shows found for this genre" });
        }

        res.status(200).json({ status: 'success', results: shows.length, data: { shows } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};