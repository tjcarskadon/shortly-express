var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// var cookieSession = require('cookie-session');
var eSession = require('express-session');


var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');
var bcrypt = require('bcrypt-nodejs');


var app = express();

app.use(eSession({
  secret: 'cat',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: true, maxAge: 60000, httpOnly: false}
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// app.use(cookieParser());
// app.use(cookieSession({
//   name: 'shortSession',
//   secret: '19879jsdklsld98ij933',
//   test: 'do I exist?'
// }));


app.get('/', 
function(req, res) {
  console.log('req.session.log', req.session);
  if (req.session.log) {
    res.render('index');
  } else {
    res.render('login');

  }
});

app.get('/create',  
function(req, res) {
  res.render('index');
});

app.get('/links', 
function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.status(200).send(links.models);
  });
});

app.get('/login', 
function(req, res) {
  console.log('login rendering&&&&&&&&&&&&&&&&')
  res.render('login');
});


app.get('/signup', 
function(req, res) {
  res.render('signup');
}); 


app.post('/signup', 
function(req, res) {
  var uri = req.body.url;
  console.log('REQ BODY POST', req.body);

  new User({ username: req.body.username}).fetch().then(function(found) {
    if (found) {
      //do something to tell the user they are already registered
      console.log('signup found', found);
      res.status(200).send();
    } else {
      Users.create({
        username: req.body.username,
        password: req.body.password
      })
      .then(function(newLink) {
        //need to do some redirect stuff here
        // res.status(200).send();
        res.redirect(301, '/');
      }).catch(e => { throw e; });
    }
  });
});
 
 
app.post('/links', 
function(req, res) { 
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      // console.log(found);
      res.status(200).send(found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }

        Links.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        })
        .then(function(newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.post('/login', 
function(req, res) {
   


  db.knex('users')
      .where('username', '=', req.body.username)
      .then(function(user) {  
        //salt and hash the incoming password
        //compare vid
        var hash = bcrypt.hashSync(req.body.password, user[0].salt);
        console.log('req password', req.body.password);
        console.log(hash);
        var fromDb = user[0].password;
        console.log(fromDb);

        if (fromDb === hash) {
          req.session.regenerate(function(err) { 
            if (!err) {
              req.session.log = true;
              req.session.username = req.body.username;
              console.log(req.session);
              // res.writeHead({location: '/'});
              // res.redirect('/');  //this passes the test but doesn't work
              res.render('index');
            } else { 
             console.log('session did not regen');
            }
          });
        }
      
      })
      .catch(function(error) { console.log(error); });


        //Look into why this didn't work later***********
      //   bcrypt.compare(fromDb, hash, function (err, results) {
      //     if (!err) {
      //       console.log(results);
      //     }
      //   });


});

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        linkId: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits') + 1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
