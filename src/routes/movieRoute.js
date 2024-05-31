const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/movie', movieController.getAllMovies);

router.get('/movie/:id', movieController.getMovieById);

router.post('/movie', movieController.createMovie);

router.put('/movie/:id', movieController.updateMovieById);

router.delete('/movie/:id', movieController.deleteMovieById);

module.exports = router;

