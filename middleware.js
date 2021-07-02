//Joi schema
const {campgroundSchema } = require('./schemas.js');
const {reviewSchema} = require('./schemas.js');

//error templates
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

//campground model
const Campground = require('./models/campground');
const Review = require('./models/reviews');

// -- VALIDATION MIDDLEWARE --

//checks if you are signed in
module.exports.isLoggedIn = (req, res, next) => {
  //console.log('REQ.USER...', req.user)
  if(!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in!');
    return res.redirect('/login');
  }
  next();
}

//checks if the review has all the correct information
module.exports.validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

//validates the camp's information
module.exports.validateCamp = (req, res, next) => {
  const {error} = campgroundSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
  //console.log(result)
}

//checks if the user is signed in AND they have the appropriate credentials to edit, delete
module.exports.isAuthor = async(req, res, next) => {
  const {id} = req.params;
  const campground = await Campground.findById(id)
  //if you are not the owner of the specific campground, you cannot edit, delete it
  if(!campground.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!')
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

//checks if the user is signed in AND they have the appropriate credentials to delete the review
module.exports.isReviewAuthor = async(req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId)
  //if you are not the owner of the specific campground, you cannot edit, delete it
  if(!review.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!')
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}