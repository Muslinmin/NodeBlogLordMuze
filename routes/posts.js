var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images'});
const { check, validationResult } = require('express-validator');
var db = require('monk')('localhost/nodeblog');


var mongoDb = require('mongodb');

//bundle errors in array for display
function errorRepackage(errorObject){
  let arrayErrors = errorObject['errors'];
  var errorPackage = [];
  arrayErrors.forEach((errors)=>{
    errorPackage.push(errors.msg);
  });
  return errorPackage;
}



router.get('/add', function(req, res, next) {
  var categories = db.get('categories');
  categories.find({}, {}, function(err, categories){
    res.render('addpost', {
      'title': 'Add Post',
      'categories': categories
    });

  });

});

router.get('/show/:id', function(req, res, next) {
  var posts = db.get('posts');
  posts.findOne({"_id": mongoDb.ObjectId(req.params.id)}, function(err, post){
    if(err){
      console.log(err);
    }else{
      res.render('show', {
        'post': post
      });
    }

  });

});


router.post('/add', upload.single('mainimage'),
[check('title').isLength({min: 1}).withMessage('Title Required'), check('body').isLength({min: 1}).withMessage('Content Required')]
,function(req, res, next) {
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var date = new Date();
  var author = req.body.author;
  if(req.file){
    var mainimage = req.file.filename;
  }else{
    var mainimage = 'noimage.jpg';
  }
  console.log(title);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errorRepackage(errors));
    res.location('/posts/add');
    res.redirect('/posts/add');
  }else{
    var posts = db.get('posts');
    posts.insert({
      "title": title,
      "body": body,
      "category": category,
      "date": date,
      "author": author,
      "mainimage": mainimage
    }, function(err, post){
      if(err){
        res.send(err);
      }else{
        req.flash('success', 'Post Added');
        res.location('/');
        res.redirect('/');
      }
    });
  }

});

module.exports = router;
