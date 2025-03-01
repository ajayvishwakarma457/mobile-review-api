const express = require('express');
const router = express.Router();

const followeNotificationController = require('../../controllers/moview/followeNotificationController');

router.get('/notification', followeNotificationController.getAllNotifications);

router.get('/notification/:id', followeNotificationController.getNotificationById);

// router.get('/notification/follower/:user_id', followeNotificationController.getNotificationByFollowerId);

router.post('/notification', followeNotificationController.createNotification);

router.put('/notification/:id', followeNotificationController.updateNotificationById);

router.delete('/notification/:id', followeNotificationController.deleteNotificationById);

module.exports = router;






