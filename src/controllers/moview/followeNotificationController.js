const FollowNotification = require('../../models/moview/followeNotificationModel');
const User = require('../../models/moview/userModel');
const Follower = require('../../models/moview/followerModel');
const Show = require('../../models/moview/showModel');
const Movie = require('../../models/moview/movieModel');



exports.getAllNotifications = async(req, res) => {
    try {
        const notifications = await FollowNotification.find({}).populate('user', 'firstname email').populate('sender', 'firstname email'); 
        res.status(200).json({status: 'success',results: notifications.length,data: { notifications }});
    } catch (error) {
        res.status(500).json({status: 'error',message: 'Server error: Cannot retrieve notifications.', error: error});
    }
};

exports.getNotificationById = async (req, res) => {
    try {
        const notification = await FollowNotification.findById(req.params.id).populate('user', 'firstname email').populate('sender', 'firstname email'); 
        if (!notification) {
            return res.status(404).json({status: 'fail',message: 'No notification found with that ID'});
        }
        res.status(200).json({status: 'success',data: { notification }});
    } catch (error) {
        res.status(500).json({status: 'error',message: 'Server error: Cannot retrieve the notification.',error: error.message});
    }
};

// exports.getNotificationByFollowerId = async(req, res) => {
//     try {        
//         let notifications = await FollowNotification.
//         find({ user_id: req.params.user_id, seen: false, is_deleted: false }).populate('user_id', 'photo username').populate('sender_user_id', 'photo username');            

//         if (!notifications) {
//             return res.status(404).json({ status: 'fail', message: 'No notification found with that ID' });
//         }

//          // Add title field based on type
//          notifications = await Promise.all(notifications.map(async (notification) => {
//             let title = '';
//             if (notification.type === 'movie') {
//                 const movie = await Movie.findById(notification.movie_show_id).select('title');
//                 title = movie ? movie.title : 'Unknown Movie';
//             } else if (notification.type === 'show') {
//                 const show = await Show.findById(notification.movie_show_id).select('title');
//                 title = show ? show.title : 'Unknown Show';
//             }
//             return { ...notification.toObject(), title };
//         }));

//         res.status(200).json({ status: 'success', length: notifications.length, data: { notifications } });
//     } catch (error) {
//         res.status(500).json({ status: 'error', message: `Server error: Cannot retrieve the notification. ${error}` });
//     }
// };


exports.createNotification = async(req, res) => {

    const { user_id, sender_user_id } = req.body;

    try {
        // Check if sender and user are the same (no self-notifications)
        if (user_id === sender_user_id) {
            return res.status(400).json({ status: 'fail', message: "You can't send a follow notification to yourself."});
        }

        // Create a new follow notification
        const newNotification = new FollowNotification({
            user: user_id, // The user receiving the notification
            sender: sender_user_id, // The user who triggered the notification
            is_read: false, 
            created_at: new Date()
        });

        // Save to the database
        await newNotification.save();
        res.status(201).json({status: 'success',message: 'Follow notification created successfully.', data: { notification: newNotification }});
    } catch (error) {
        console.error('Error creating follow notification:', error);
        res.status(500).json({status: 'error',message: 'Internal server error',error: error.message});
    }

};

exports.updateNotificationById = async(req, res) => {
    try {
        const { is_read, is_deleted } = req.body;
        // Only allow updating specific fields
        const updateData = {};
        if (is_read !== undefined) updateData.is_read = is_read;
        if (is_deleted !== undefined) updateData.is_deleted = is_deleted;
        updateData.updated_at = new Date(); // Update timestamp

        const notification = await FollowNotification.findByIdAndUpdate(req.params.id,updateData,{ new: true, runValidators: true });

        if (!notification) {
            return res.status(404).json({status: 'fail',message: 'No notification found with that ID'});
        }
        res.status(200).json({status: 'success',message: 'Notification updated successfully',data: { notification }});
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({status: 'error',message: 'Server error: Cannot update the notification.',error: error.message});
    }
};

exports.deleteNotificationById = async(req, res) => {
    try {
        const notification = await FollowNotification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({ status: 'fail', message: 'No notification found with that ID' });
        }

        res.status(200).json({status: 'success',message: 'Notification deleted successfully', data: { _id: notification._id }});

    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ status: 'error', message: 'Server error: Cannot delete the notification.', error: error.message });
    }
};