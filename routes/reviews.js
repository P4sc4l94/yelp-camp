const express = require('express');
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews'); //holds the functions/logic for the reviews router

//Joi schema
const {reviewSchema} = require('../schemas.js')

//error templates
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

//campground model
const Campground = require('../models/campground');
//review model
const Review = require('../models/reviews')

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');


// -- ROUTES --
// functions for routes found in CONTROLLERS >> REVIEWS

//add a review to a specific camp
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//delete a review from a specific camp
// $pull takes the campground id and removes anything with the particular reviewId in that campground
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;