var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



var User = db.Model.extend({
  tableName: 'users',
  initialize: function() {
    console.log('this.get', this.get('username'));
  } 
});

module.exports = User;