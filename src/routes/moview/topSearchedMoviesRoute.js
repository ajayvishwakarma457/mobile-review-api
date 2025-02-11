const express = require('express');
const router = express.Router();
const topSearchedMoviesController = require('../../controllers/moview/topSearchedMoviesController');

router.get('/top-searched-movies', topSearchedMoviesController.getAllTopMovies);
router.post('/top-searched-movies', topSearchedMoviesController.AddTopMovie);

module.exports = router;

