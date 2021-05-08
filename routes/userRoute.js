const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/userControllers');

router.get('v1/api/users', userControllers.getUsers);

router.get('v1/api/users/email=:email', userControllers.getUserByEmail);

router.get('v1/api/users/:id', userControllers.getUserByID);

router.post('v1/api/registration', userControllers.postRegistration);

router.post('v1/api/login', userControllers.loginUser);

// router.patch('/users/:id', userControllers.editUser);
//
router.delete('v1/api/users/:id', userControllers.deleteUser);

module.exports = router;