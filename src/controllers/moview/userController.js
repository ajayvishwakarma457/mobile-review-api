const bcrypt = require('bcrypt');
const User = require('../../models/moview/userModel');

const Follower = require('../../models/moview/followerModel');
const Following = require('../../models/moview/followingModel');
const Favorites = require('../../models/moview/favouriteModel');
const Notification = require('../../models/moview/notificationModel');
const Review = require('../../models/moview/reviewModel');
const ReviewShow = require('../../models/moview/reviewShowModel');
const ShowNotification = require('../../models/moview/showNotificationModel');

const Movie = require('../../models/moview/movieModel');
const Show = require('../../models/moview/showModel');

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ status: 'success', results: users.length, data: { users } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve users.' });
    }
};

// exports.getOtherUserDetails = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Fetch user details
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ status: 'error', message: 'User not found' });
//         }

//         // Count the number of followers
//         const followersCount = await Follower.countDocuments({ userId: userId });

//         // Count the number of users this user is following
//         const followingCount = await Following.countDocuments({ userId: userId });

//         // Find reviews by this user
//         const reviews = await Review.find({ user: userId });
//         const reviewShows = await ReviewShow.find({ user: userId });
        
//         // Separate reviews for movies and shows
//         const movieReviews = reviews.filter(review => review.movie);
//         const showReviews = reviewShows.filter(review => review.show);

//         // Fetch the list of movies the user reviewed
//         const movies = await Movie.find({ _id: { $in: movieReviews.map(r => r.movie) } });

//         // Fetch the list of shows the user reviewed
//         const shows = await Show.find({ _id: { $in: showReviews.map(r => r.show) } });

//         // Send the response
//         res.status(200).json({
//                 status: 'success',
//                 data: {
//                     user,
//                     totalReviewedMovies: movieReviews.length,
//                     totalReviewedShows: showReviews.length,
//                     followersCount,
//                     followingCount,
//                     reviewedMovies: movies,
//                     reviewedShows: shows
//                 }});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve user details.' });
//     }
// };

exports.getOtherUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user details
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Count the number of followers
        const followersCount = await Follower.countDocuments({ userId: userId });

        // Count the number of users this user is following
        const followingCount = await Following.countDocuments({ userId: userId });

        // Find reviews by this user with movies populated
        const reviews = await Review.find({ user: userId }).populate('movie');
        const reviewShows = await ReviewShow.find({ user: userId }).populate('show');

        // Get correct counts
        const totalReviewedMovies = reviews.length;
        const totalReviewedShows = reviewShows.length;

        // // Fetch the list of movies reviewed with ratings
        // const movies = reviews.map(review => ({
        //     _id: review.movie ? review.movie._id : null,
        //     title: review.movie ? review.movie.title : 'Unknown',
        //     poster_url: review.movie ? review.movie.poster_url : '',
        //     rating: review.rating
        // })).filter(movie => movie._id); // Remove null values

        // // Fetch the list of shows reviewed with ratings
        // const shows = reviewShows.map(review => ({
        //     _id: review.show ? review.show._id : null,
        //     title: review.show ? review.show.title : 'Unknown',
        //     poster_url: review.show ? review.show.poster_url : '',
        //     rating: review.rating
        // })).filter(show => show._id); // Remove null values


        const movies = reviews
                        .map(review => review.movie ? { ...review.movie.toObject(), rating: review.rating } : null)
                        .filter(movie => movie); // Remove null values


        // Fetch the list of shows reviewed with ratings
        const shows = reviewShows
                        .map(review => review.show ? { ...review.show.toObject(), rating: review.rating } : null)
                        .filter(show => show); // Remove null values


        // Send the response
        res.status(200).json({
            status: 'success',
            data: {
                user,
                totalReviewedMovies,
                totalReviewedShows,
                followersCount,
                followingCount,
                reviewedMovies: movies,
                reviewedShows: shows
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve user details.' });
    }
};

exports.getUserByName = async(req, res) => {
    try {
        const { name, userId } = req.body;
        if (!name) {
            return res.status(400).json({ status: 'error', message: 'Name query parameter is required' });
        }

        // Find users by name or username
        const users = await User.find({
            $or: [
                { firstname: { $regex: name, $options: 'i' } },
                { username: { $regex: name, $options: 'i' } }
            ]
        });

        if (users.length === 0) {
            return res.status(200).json({ status: 'error', message: 'No users found' });
        }

        // Get list of users that the current user is following
        const followingList = await Following.find({ userId }).select('followingId');
        const followingIds = followingList.map(f => f.followingId.toString());

        // Modify user list to include isFollowing property
        const modifiedUsers = users.map(user => {
            return {
                ...user.toObject(),
                isFollowing: followingIds.includes(user._id.toString())
            };
        });

        res.status(200).json({ status: 'success', results: modifiedUsers.length, data: { users: modifiedUsers } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve users.' });
    }
};

exports.getSuggestedUserById = async(req, res) => {
    try {
        const { userId } = req.params; // Getting userId from params
                
        if (!userId) {
            return res.status(400).json({ status: 'error', message: 'User ID is required' });
        }

        // Get list of users that the current user is following
        const followingList = await Following.find({ userId }).select('followingId');
        const followingIds = followingList.map(f => f.followingId.toString());

        // Find users excluding the current user and users they already follow
        const users = await User.find({ _id: { $nin: [...followingIds, userId] } });
        


        if (users.length === 0) {
            return res.status(200).json({ status: 'error', message: 'No users found' });
        }

        // Modify user list to include isFollowing property (all should be false)
        const modifiedUsers = users.map(user => ({ ...user.toObject(), isFollowing: false }));

        res.status(200).json({ status: 'success', results: modifiedUsers.length, data: { users: modifiedUsers } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve users.' });
    }
};

exports.getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'No user found with that ID' });
        }
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error: Cannot retrieve the user.' });
    }
};

exports.createUser = async(req, res) => {    
    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            firstname: req.body.firstname,
            username: req.body.username,
            email: req.body.email,
            password_hash: hashedPassword,
            phone: req.body.phone || '*****'
        });

        res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ status: 'error...', message: errors });
        } else if (error.code === 11000) {
            return res.status(400).json({ status: 'error', message: 'User name or email already exists.' });
        } else {
            console.log('Error : ', error);
            return res.status(500).json({ status: 'error', message: 'Server error: Cannot create the user.' });
        }
    }
};

exports.updateUserById = async(req, res) => {



    try {
        // If password is provided in the request body, hash it

        const userData = await User.findById(req.params.id);

        const isOldPassword = userData.password_hash === req.body.password;

        if (isOldPassword) {
            req.body.password_hash = req.body.password;
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password_hash = hashedPassword;
        }

        // Find and update the user by ID
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        // Handle case where user is not found
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'No user found with that ID' });
        }

        // Respond with updated user data
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ status: 'error', message: `Server error: Cannot update the user. ${error}` });
    }
};

// exports.deleteUserById = async (req, res) => {    
//     try {
//         const user = await User.findOneAndUpdate({ _id: req.params.id }, { $set: { is_deleted: true } }, { new: true });
//         if (!user) {
//             return res.status(404).json({ status: 'fail', message: 'No user found with that ID' });
//         }
//         return res.status(200).json({ status: 'success', data: null, message: 'User deleted successfully' });
//     } catch (error) {
//         return res.status(500).json({ status: 'error', message: 'Server error: Cannot delete the user.' });
//     }
// };

exports.deleteUserById = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {

            await Promise.all([
                Follower.deleteMany({ userId: req.params.id }),
                Following.deleteMany({ userId: req.params.id }),
                Favorites.deleteMany({ user: req.params.id }),
                Notification.deleteMany({ user_id: req.params.id }),
                Review.deleteMany({ user: req.params.id }),
                ReviewShow.deleteMany({ user: req.params.id }),
                ShowNotification.deleteMany({ user_id: req.params.id })
            ]);

            return res.status(404).json({ status: 'fail', message: 'No user found with that ID' });
        }
        return res.status(200).json({ status: 'success', data: null, message: 'User deleted permanently' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Server error: Cannot delete the user.' });
    }
};


// exports.forgetPassword = async(req, res) => {
//     const { email } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         const resetToken = crypto.randomBytes(32).toString('hex');
//         user.reset_password_token = resetToken;
//         user.reset_password_expires = Date.now() + 3600000;
//         await user.save();

//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'moviu.spakcomm@gmail.com',
//                 pass: 'zdxsrxogxgpdlqbk'
//             },
//         });

//         const mailOptions = {
//             to: user.email,
//             from: 'moviu.spakcomm@gmail.com',
//             subject: 'Password Reset',
//             text: `Please click the following link to reset your password: \n https://moviu.in/reset-password.html?token=${encodeURIComponent(resetToken)}`
//         };

//         transporter.sendMail(mailOptions, (err, response) => {
//             if (err) {
//                 console.error('Error sending email:', err);
//                 return res.status(500).json({ success: false, message: 'Error sending email' });
//             }
//             console.log('Ram....', email);
//             res.status(200).json({ success: true, message: 'Password reset email sent' });
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };


// exports.resetPassword = async(req, res) => {
//     const { token } = req.params;
//     const { newPassword } = req.body;
//     try {
//         const user = await User.findOne({
//             reset_password_token: token,
//             reset_password_expires: { $gt: Date.now() },
//         });

//         if (!user) {
//             return res.status(400).json({ success: false, message: 'Invalid or expired token' });
//         }

//         user.password_hash = newPassword;
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpires = undefined;
//         await user.save();

//         res.status(200).json({ success: true, message: 'Password has been reset' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };