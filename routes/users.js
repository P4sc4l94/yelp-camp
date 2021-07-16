const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {isLoggedIn, isAuthor, validateCamp} = require('../middleware');

const users = require('../controllers/users') //holds the functions/logic for the users routes

// -- ROUTES --
//functions can be found in CONTROLLERS >> USERS

//registers user
router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.register));

//logging in users
router.get('/login', users.renderLogin);

//checks authentication using passport against users already registered
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

//log out user
router.get('/logout', users.logout);

//displays user's profile page
router.get('/profile/:id', catchAsync(users.showProfile));

//show user profile edit page
router.get('/edit/:id', catchAsync(users.renderEditProfile));

//post updated user profile info
router.put('/profile/:id', isLoggedIn, catchAsync(users.editProfile));

//show change user icon form
/*router.get('/change-icon/:id', catchAsync(users.renderChangeIcon));*/

module.exports = router;
