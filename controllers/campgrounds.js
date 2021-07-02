// -- CAMPGROUND CONTROLLER --

const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken})

//campground model
const Campground = require('../models/campground');
const Review = require('../models/reviews')

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  return res.render('campgrounds/index', {campgrounds})
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.createCampground = async(req, res, next) => {
  //takes info from geocoding API
  const geodata = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  //res.send(geodata.body.features[0].geometry);
  
  const campground = new Campground(req.body.campground);
  campground.geometry = geodata.body.features[0].geometry;
  campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
  campground.author = req.user._id;
  await campground.save();
  console.log(campground)
  req.flash('success', 'Successfully made a new campground!')
  return res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
  //const campgrounds = await Campground.find({})
  const campground = await Campground.findById(req.params.id).populate({
    path:'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  //console.log(campground)
  if(!campground){
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/show', {campground})
}

module.exports.renderEditForm = async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/edit', {campground})
}

module.exports.updateCampground = async(req, res) => {
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    } 
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
    console.log(campground)
  }
  
  req.flash('success', 'Successfully updated campground!')
  return res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async(req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Campground deleted!')
  return res.redirect('/campgrounds');
}