var bcrypt = require('bcryptjs');
var passport = require('passport');
var db = require('monk')('localhost/nodeblog');



var userCollection = db.get('users');



module.exports.createUser = function createUser(email, name, password, callback){
  var user = {};
  user.name = name;
  user.email = email;
  user.password = password;
 bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        userCollection.insert(user, callback(false, "Success! You may now login!"));
        if(err){
          callback(err, false);
        }
    });
 });
}



module.exports.getUserById = function(id, callback){
  var query = {_id: id};
  userCollection.findOne(query, callback);
}

module.exports.getUserByUsername = function(username, callback){
  var query = {name: username};
  userCollection.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  // Load hash from your password DB.
bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    // res === true
    callback(null, isMatch);
});

};
