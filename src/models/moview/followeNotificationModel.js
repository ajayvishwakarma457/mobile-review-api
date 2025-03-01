const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');


const followNotificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },    
    is_read: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const FollowNotification = mongoose.model.FollowNotification || mongoose.model('FollowNotification', followNotificationSchema);
module.exports = FollowNotification;