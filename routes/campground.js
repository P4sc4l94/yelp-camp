const express = require('express');
const router = express.Router();
const {isLoggedIn, isAuthor, validateCamp} = require('../middleware');
const campgrounds = require('../controllers/campgrounds'); //holds all the campground router functions/logic

//Cloudinary
const {storage} = require('../cloudinary')

//Multer
//https://github.com/expressjs/multer/blob/master/README.md
const multer  = require('multer')
const upload = multer({ storage })


//Joi schema
const {campgroundSchema } = require('../schemas.js')

//error templates
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

//campground model
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const reviews = require('../models/reviews');


// -- ROUTES --
//FUNCTIONS FOR EACH ROUTE ARE IN CONTROLLERS >> CAMPGROUNDS
//all campgrounds index page - views/campgrounds/index.ejs
router.get('/', catchAsync(campgrounds.index));


//router.route('/').get('/', catchAsync(campgrounds.index)).post('/', validateCamp, isLoggedIn, catchAsync(campgrounds.createCampground));

//to create a new campground
//render add campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

//send new campground data
router.post('/', isLoggedIn, upload.array('image'), validateCamp, catchAsync(campgrounds.createCampground))

//show a campground by id
router.get('/:id', catchAsync(campgrounds.showCampground))

//edit campground by id
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCamp, catchAsync(campgrounds.updateCampground))

//delete campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;