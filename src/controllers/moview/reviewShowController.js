const ReviewShow = require('../../models/moview/reviewShowModel');
const ShowReviewComment = require('../../models/moview/showReviewCommentModel');

exports.getAllReviews = async(req, res) => {
    try {
        const reviews = await ReviewShow.find({});
        res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve reviews...' });
    }
};

exports.getReviewById = async(req, res) => {
    try {
        const review = await ReviewShow.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ status: 'fail', message: 'No review found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { review } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve the review.' });
    }
};

// exports.createReview = async (req, res) => {
//     try {
//         const newReview = await ReviewShow.create(req.body);
//         res.status(201).json({ status: 'success', data: { notification: newReview } });
//     } catch (error) {
//         return res.status(500).json({ status: 'error', message: 'Server error: Cannot create the review.' });
//     }
// };

exports.createReview = async(req, res) => {
    try {
        const newReview = await ReviewShow.create(req.body);
        const fullReview = await ReviewShow.findById(newReview._id);
        const reviews = await ReviewShow
            .findById(fullReview._id)
            .populate('user', 'firstname')
            .sort({ created_at: -1 });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this movie' });
        }
        res.status(200).json({ status: 'success', results: newReview.length, data: { reviews } });
        //res.status(201).json({ status: 'success', data: { notification: newReview } });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Server error: Cannot create the review.' });
    }
};



exports.updateReviewById = async(req, res) => {
    try {
        const review = await ReviewShow.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!review) {
            return res.status(404).json({ status: 'fail', message: 'No review found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { review } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot update the notification.' });
    }
};

// exports.deleteReviewById = async(req, res) => {
//     try {
//         const review = await ReviewShow.findOneAndUpdate({ _id: req.params.id }, { $set: { is_deleted: true } }, { new: true });
//         if (!review) {
//             return res.status(404).json({ status: 'fail', message: 'No review found with that ID' });
//         }
//         res.status(204).json({ status: 'success', data: null, message: 'review deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ status: 'error', message: 'Server error: Cannot delete the review.' });
//     }
// };

exports.deleteReviewById = async(req, res) => {
    try {
        const review = await ReviewShow.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ status: 'fail', message: 'No review found with that ID' });
        }
        res.status(200).json({ status: 'success', data: review, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot delete the review.' });
    }
};

exports.getReviewsByShow = async(req, res) => {
    try {
        const showId = req.params.showId;

        const reviews = await ReviewShow
            .find({ show: showId, is_deleted: false })
            .populate('user', 'firstname photo')
            .sort({ created_at: -1 });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this movie' });
        }

        res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getReviewsByUser = async(req, res) => {
    try {
        const userId = req.params.userId;

        // Find reviews for the movie
        //const reviews = await Review.find({ movie: movieId, is_deleted: false }).populate('user', 'name'); // Populate user name, adjust fields as needed
        let reviews = await ReviewShow
            .find({ user: userId, is_deleted: false })
            // .populate('show', 'title genre release_date poster_url isShow')
            .populate('show')
            .sort({ created_at: -1 });

        reviews = reviews.map(review => ({
            ...review._doc,
            isShow: true
        }));


        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this user' });
        }

        res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getShowRatingById = async(req, res) => {
    try {

        const showId = req.params.showId;
        const shows = await ReviewShow.find({ show: showId, is_deleted: false });

        const totalshow = shows.length
        const totalRating = shows.reduce((sum, review) => sum + review.rating, 0);
        const finalRating = totalRating / totalshow;

        res.status(200).json({ status: 'success', data: finalRating });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.likeReviewByUserId = async(req, res) => {    
    try {
        const { reviewId } = req.params;
        const userId = req.body.userId; 

        const review = await ReviewShow.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this review' });
        }

        review.likes.push(userId);
        await review.save();
 
        res.status(200).json({ status: 'success', message: 'Review liked successfully', data: review.likes.length });
    } catch (error) {        
        return res.status(500).json({ status: 'error', message: `Server error: Cannot create the like. ${error}` });
    }
};

exports.unlikeReviewByUserId = async(req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.body.userId; 

        const review = await ReviewShow.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (!review.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have not liked this review' });
        }

        review.likes = review.likes.filter(id => id.toString() !== userId.toString());
        await review.save();
 
        res.status(200).json({ status: 'success', message: 'Review unliked successfully', data: review.likes.length });
    } catch (error) {        
        return res.status(500).json({ status: 'error', message: 'Server error: Cannot create the unlike.' });
    }
};


//http://localhost:3333/api/review-show/67a30c41dee8c7cd3d05469c/comment
// {
//     "userId":"67977880dee8c7cd3de1d9b9",
//     "text":"Nice Comment"
// }
exports.commentByUserId = async(req, res) => {
    try {
        const { reviewId } = req.params;
        const { text, userId } = req.body;
        
        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        const review = await ReviewShow.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Create a new comment
        const newComment = new ShowReviewComment({user: userId,review: reviewId,text});
        await newComment.save();

        // Add the comment reference to the review
        review.comments.push(newComment._id);
        await review.save();

        res.status(200).json({ status: 'success', message: 'Comment created successfully' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: `Server error: Cannot create the comment. ${error}` });        
    }
};

exports.getCommentByReviewId = async(req, res) => {    
    try {
        const data = await ShowReviewComment.find({review:req.params.reviewId}).populate('user', '-password_hash -reset_password_token -reset_password_expires -is_deleted -created_at -updated_at -deleted_at');

        if (!data) {
            return res.status(404).json({ status: 'fail', message: 'No comment found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { data } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve the comment.' });
    }
};