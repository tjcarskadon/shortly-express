var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
// Promise.promisifyAll(bcrypt);


var User = db.Model.extend({
  tableName: 'users',
  
  initialize: function() {
   //create a salt and store in a var
    var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync(this.get('password'), salt);
   //hash and salt the password
   //store salt and hash/salted password in dbase
    this.set('password', hash);
    // this.set('password', this.get('password'));
    this.set('salt', salt);

  },

  testMe: function() {
    console.log('this did something');
  } 
});

module.exports = User;