// -- REVIEWS CONTROLLER --


//campground model
const Campground = require('../models/campground');
//REVIEWS MODEL
//const reviews = require('../models/reviews.js');
const Review = require('../models/reviews')

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  //const reviewDate = new Date().toUTCString();
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save()
  await campground.save()
  req.flash('success', 'Created new review!')
  return res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  //res.send('Delete Me!!!')
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted!')
  return res.redirect(`/campgrounds/${id}`)
}