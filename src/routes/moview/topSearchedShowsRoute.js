const express = require('express');
const router = express.Router();
const topSearchedShowsController = require('../../controllers/moview/topSearchedShowsController');

router.get('/top-searched-shows', topSearchedShowsController.getAllTopShows);
router.post('/top-searched-shows', topSearchedShowsController.AddTopShow);

module.exports = router;

