var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var db = require('monk')('localhost/nodeblog');


//bundle errors in array for display
function errorRepackage(errorObject){
  let arrayErrors = errorObject['errors'];
  var errorPackage = [];
  arrayErrors.forEach((errors)=>{
    errorPackage.push(errors.msg);
  });
  return {errors: errorPackage};
}



router.get('/add', function(req, res, next) {

    res.render('addcategory', {
      'title': 'Add Category'
    });



});

router.post('/add',check('name').isLength({min: 1}).withMessage('Category Required!'), function(req, res, next) {
  var name = req.body.name;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
  }else{
    var categories = db.get('categories');
    categories.insert({
      "name": name
    }, function(err, post){
      if(err){
        res.send(err);
      }else{
        req.flash('success', 'Category Added');
        res.location('/');
        res.redirect('/');
      }
    });
  }

});

module.exports = router;
