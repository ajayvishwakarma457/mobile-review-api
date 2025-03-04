const express = require('express');
const router = express.Router();
const bannerController = require('../../controllers/moview/bannerController');

router.get('/banner', bannerController.getAllBanners);
router.get('/banner/:id', bannerController.getBannerById);
router.post('/banner', bannerController.createBanner);
router.put('/banner/:id', bannerController.updateBannerById);
router.delete('/banner/:id', bannerController.deleteBannerById);

module.exports = router;

