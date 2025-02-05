const express = require('express');
const router = express.Router();
const reviewShowController = require('../../controllers/moview/reviewShowController');

router.get('/review-show', reviewShowController.getAllReviews);

router.get('/review-show/:id', reviewShowController.getReviewById);

router.get('/review-show/show/:showId', reviewShowController.getReviewsByShow);

router.get('/review-show/user/:userId', reviewShowController.getReviewsByUser);

router.get('/review-show/show-rating/:showId', reviewShowController.getShowRatingById);

router.post('/review-show', reviewShowController.createReview);

router.put('/review-show/:id', reviewShowController.updateReviewById);

router.delete('/review-show/:id', reviewShowController.deleteReviewById);

// Like a review
router.post('/review-show/:reviewId/like', reviewShowController.likeReviewByUserId);
router.post('/review-show/:reviewId/unlike', reviewShowController.unlikeReviewByUserId);

// Add a comment to a review
router.post('/review-show/:reviewId/comment', reviewShowController.commentByUserId);

module.exports = router;

