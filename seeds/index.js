//adds cities to database with name and location (city,state)

const methodOverride = require('method-override')
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const mongoose = require('mongoose');

const Campground = require('../models/campground');

//sets up the yelpCamp database and connects to Mongoose server
mongoose.connect('mongodb://localhost:27017/yelpCamp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })



//error handling for connecting to the database
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
  console.log('Database connected');
})

const sample = array => array[Math.floor(Math.random() * array.length)];


//creates 50 cities from cities array
const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i=0; i < 200; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '60d2480b1c955a1329fcf597', //tim's id
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dg92t6syv/image/upload/v1624658702/YelpCamp/vs3buelxnyr4tcwryuyc.jpg',
          filename: 'YelpCamp/vs3buelxnyr4tcwryuyc'
        },
        {
          url: 'https://res.cloudinary.com/dg92t6syv/image/upload/v1624658702/YelpCamp/axtdvdm8hlppmho8gntk.webp',
          filename: 'YelpCamp/axtdvdm8hlppmho8gntk'
        }

      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio in architecto quisquam placeat atque, officiis neque nemo inventore necessitatibus exercitationem voluptas ab dicta odio vero autem, nihil voluptatem assumenda dolore!',
      price
    })
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});