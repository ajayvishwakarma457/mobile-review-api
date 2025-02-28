const express = require('express');
const router = express.Router();
const followingFollowerController = require('../../controllers/moview/followingFollowerController');

router.post('/follow', followingFollowerController.addFollower);

router.post('/unfollow', followingFollowerController.removeFollower);

router.post('/check-if-following', followingFollowerController.checkIfFollowing);

router.get('/following/:userId', followingFollowerController.findFollowingByUserId);

router.get('/follower/:userId', followingFollowerController.findFollowerByUserId);

router.get('/other-user-follower/:userId/:currentUserId', followingFollowerController.findFollowerOtherUserByUserId);

module.exports = router;
