const TopSearchedShows = require('../../models/moview/topSearchedShowsModel');



exports.AddTopShow = async (req, res) => {
    try {
        const { showId } = req.body;
        if (!showId) {
            return res.status(400).json({ status: 'error', message: 'Show ID is required.' });
        }

        let topSearchedShow = await TopSearchedShows.findOne({ show: showId });

        if (topSearchedShow) {
            topSearchedShow.search_count += 1;
            topSearchedShow.last_searched_at = Date.now();
        } else {
            topSearchedShow = new TopSearchedShows({ show: showId, search_count: 1 });
        }

        await topSearchedShow.save();
        res.status(201).json({ status: 'success', data: { topSearchedShow } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot add show.' });
    }
}

exports.getAllTopShows = async(req, res) => {
    try {        
        const shows = await TopSearchedShows.find().sort({ search_count: -1 }).populate('show');         
        res.status(200).json({ status: 'success', results: shows.length, data: { shows } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve shows.' });
    }
};

