const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/moview/movieController');

router.get('/movie', movieController.getAllMovies);

router.get('/movie-top-rated', movieController.getTopRatedMovies);

router.post('/movie-by-genre', movieController.getMoviesByGenre);
//router.post('/movie/search', movieController.searchMovies);

router.get('/movie/:id', movieController.getMovieById);

router.post('/movie', movieController.createMovie);

router.put('/movie/:id', movieController.updateMovieById);

router.delete('/movie/:id', movieController.deleteMovieById);

module.exports = router;

