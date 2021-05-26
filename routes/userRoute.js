const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/userControllers');

// Colletions :

router.get('/users', userControllers.getUsers);
router.get('/users/:id', userControllers.getUserByID);

router.post('/registration', userControllers.postRegistration);

router.post('/login', userControllers.loginUser);

// router.patch('/users/:id', userControllers.editUser);

router.delete('/users/:id', userControllers.deleteUser);

module.exports = router;