// -- USER CONTROLLER --

//models
const User = require('../models/user');
const Campground = require('../models/campground');
const reviews = require('../models/reviews.js');

const passport = require('passport');

module.exports.renderRegister =  (req, res) => {
  return res.render('users/register')
}

module.exports.register = async (req, res, next) => {
  try{
    const {email, username, password} = req.body;
    const {image} = req.body;
    const user = new User({email, username, image});
    const registeredUser = await User.register(user, password);
    //console.log(registeredUser);
    req.login(registeredUser, err => {
      if(err) return next(err);
      req.flash('success', `Welcome to Yelp Camp, ${username}!`);
      return res.redirect('/campgrounds');
    }) //after user registers, keeps them logged in
    
  } catch(e){
    req.flash('error', e.message);
    return res.redirect('register');
  }
  
};

module.exports.renderLogin = (req, res) => {
  return res.render('users/login')
};

module.exports.login = (req, res) => {
  const {username} = req.body;
  req.flash('success', `Welcome Back, ${username}!`);
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  return res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Goodbye!')
  delete req.session.returnTo;
  return res.redirect('/campgrounds'); 
};

//show user profile page
module.exports.showProfile = async (req, res, next) => {
  return res.render(`users/profile`);
};

//show edit user information page
module.exports.renderEditProfile = async (req, res, next) => {
  const id = req.user._id
  const email = req.user.email
  const username = req.user.username
  const user = await User({email, username});
  /*
  console.log(user)
  console.log(userEmail)
  console.log(username)
  */
  if(!user){
    req.flash('error', 'Cannot find that user!');
    return res.redirect('/campgrounds');
  }
  return res.render('users/edit', {user});
};

module.exports.editProfile = async (req, res, next) => {
  const {id} = req.params;
  const {username} = req.body.user;
  const {email} = req.body.user;
  const {image} = req.body.user

  const user = await User.findOneAndUpdate(id, {$set: {username: username, email: email, image: image}}, {
    new: true
  });
  await user.save();

  console.log(user);
  //req.logout();
  req.flash('success', 'Successfully updated profile!')
  return res.redirect(`/login`);
  

  
  //res.send(req.body)
  //{ users: { username: 'tim22', email: 'tim@gmail.com' } }
};

/*
module.exports.renderChangeIcon = async (req, res, next) => {
  return res.send('/change-icon')
}
*/
