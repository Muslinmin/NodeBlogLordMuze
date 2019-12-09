var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');
var db = require('monk')('localhost/nodeblog');
var User = require('../models/user');

var passport = require('passport');
var LocalSrategy = require('passport-local').Strategy;


function errorRepackage(errorObject){
  let arrayErrors = errorObject['errors'];
  var errorPackage = [];
  arrayErrors.forEach((errors)=>{
    errorPackage.push(errors.msg);
  });
  return errorPackage;
}


//Passport Middleware configuration

passport.use(new LocalSrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err){
      throw err;
    }
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err){
        return done(err);
      }
      if(isMatch){
        return done(null, user);
      }else{
        return done(null, false, {message: 'Invalid Password'});[[]]
      }
    });
  });
}));




router.get('/register', function(req, res, next){
   res.render('registerPage', {
    'title': 'Register'
  });
});

router.post('/register', [check('email').isEmail().withMessage('Email required!'),
  check('username').isLength({min: 1}).withMessage('Username required!'),
  check('password').isLength({min: 1}).withMessage('Password required!')
], function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errorRepackage(errors));
  } else if (req.body.password2.match(req.body.password)){
    User.createUser(req.body.email, req.body.username, req.body.password, function(err, msg){
      console.log(err);
      if(err){
        req.flash('error', err);
      }else{
        req.flash('success', "Success! Now you can login!");
        res.location('/users/login');
        res.redirect('/users/login');
      }

    });
  }else{
      req.flash('error', "Password does not match");
  }


});

//login
router.get('/login', function(req, res, next){
   res.render('login', {
    'title': 'Login'
  });
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    req.flash('success', 'You are now logged in!');
    res.redirect('/');
    console.log("Login Successful!");
  });



//Passport serialization

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/users/login');
});


module.exports = router;
