const Show = require('../../models/moview/showModel');
const Movie = require('../../models/moview/movieModel');
const Banner = require('../../models/moview/bannerModel');

exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ is_deleted: false }).sort({ _id: -1 });
        res.status(200).json({ status: 'success', results: banners.length, data: { banners } });
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve banners.' });
    }
};

exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ status: 'fail', message: 'No banner found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { banner } });
    } catch (error) {
        console.error('Error fetching banner:', error);
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve the banner.' });
    }
};

exports.createBanner = async (req, res) => {
    try {
        const newBanner = await Banner.create(req.body);
        res.status(201).json({ status: 'success', data: { banner: newBanner } });
    } catch (error) {
        console.error('Error creating banner:', error);
        res.status(500).json({ status: 'error', message: 'Server error: Cannot create the banner.' });
    }
};

exports.updateBannerById = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!banner) {
            return res.status(404).json({ status: 'fail', message: 'No banner found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { banner }, message: 'Banner updated successfully' });
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({ status: 'error', message: 'Server error: Cannot update the banner.' });
    }
};

exports.deleteBannerById = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ status: 'fail', message: 'No banner found with that ID' });
        }
        res.status(200).json({ status: 'success', message: 'Banner deleted permanently' });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({ status: 'error', message: 'Server error: Cannot delete the banner.' });
    }
};
