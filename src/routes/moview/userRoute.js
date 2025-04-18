const express = require('express');
const router = express.Router();
const userController = require('../../controllers/moview/userController');

router.get('/user', userController.getAllUsers);

router.get('/user-suggested/:userId', userController.getSuggestedUserById);

router.get('/user-other-user/:userId', userController.getOtherUserDetails);

router.post('/user-by-name', userController.getUserByName);

router.get('/user/:id', userController.getUserById);

router.post('/user', userController.createUser);

router.put('/user/:id', userController.updateUserById);

router.delete('/user/:id', userController.deleteUserById);

// router.post('/user/forgot-password', userController.forgetPassword);
// router.post('/user/reset-password/:token', userController.resetPassword);

module.exports = router;