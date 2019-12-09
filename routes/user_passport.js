var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
const { check, validationResult } = require('express-validator');

var User = require('../models/user');
var passport = require('passport');
var LocalSrategy = require('passport-local').Strategy;




/* GET users listing. */












router.post('/register', upload.single('profileimage'),[check('name').isLength({ min: 1 }).withMessage("Name Required"),
check('email').isEmail().withMessage("Email required"),
 check('username').isLength({min: 1}).withMessage("Username Required"),
check('password').isLength({min: 1}).withMessage("Password Required")
],function(req, res, next) {



  if(req.file){
    console.log('Uploading File....');
    var profileimage = req.file.filename;
  }else{
    console.log('No File Uploaded...');
    var profileimage = 'noimage.jpg';
  }



  //Check Errors
  const errors = validationResult(req);
  if(!(req.body.password2.match(req.body.password))){
    console.log("Error Password don't match");
  }else if (!errors.isEmpty()) {
    return res.render('register', errorRepackage(errors));
  }else{
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      profileimage: req.body.profileimage
    });
    User.createUser(newUser, function(err, user){
      if(err){
        throw err;
        console.log(user);
      }
      req.flash('success', 'You are now registered and can login!');
      res.location('/');
      res.redirect('/');
    });
  }


});


router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/users/login');
});

module.exports = router;
