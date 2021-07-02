// -- USER CONTROLLER --

//models
const User = require('../models/user');
const Campground = require('../models/campground');
const reviews = require('../models/reviews.js');

module.exports.renderRegister =  (req, res) => {
  return res.render('users/register')
}

module.exports.register = async (req, res, next) => {
  try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    //console.log(registeredUser);
    req.login(registeredUser, err => {
      if(err) return next(err);
      req.flash('success', 'Welcome to Yelp Camp!');
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
  req.flash('success', 'Welcome Back!');
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