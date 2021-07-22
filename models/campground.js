const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

//https://res.cloudinary.com/dg92t6syv/image/upload/v1624664816/YelpCamp/aaqotx06z1wxmiqfvop2.jpg

const ImageSchema  = new Schema({
  url: String,
  filename: String
})

//a virtual that adds the W_200 to the image's url
//doesn't add the urls to our database (it's virtual)
ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: { //From Mongo Geo docs
    type: {
      type: String, //Don't do `{location: {type: String}}`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId, //objectId from the Review model
      ref: 'Review'
    }
  ]
}, opts);

//Campground virtual property for popup
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>$${this.price}<br>
  <small><i>${this.location}</i></small></p>`
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if(doc){
    await Review.remove({
      _id: {
        $in: doc.reviews
      }
    })
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
