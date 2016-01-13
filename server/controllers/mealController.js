var Q = require('q');
var Meal = require('../models/mealModel.js');
var User = require('../models/userModel.js');
var fs = require('fs')
var path = require('path')
var multiparty = require('multiparty')


//findone is the actual mongoose method, and it is being called on the Meal model provided as the second arg. 
var findMeal = Q.nbind(Meal.findOne, Meal);
// create meal is a method that uses the create mongoose method to instantiate a new Meal model
var createMeal = Q.nbind(Meal.create, Meal);
//method for showing all Meal instances
var findAllMeals = Q.nbind(Meal.find, Meal);
var readFile = Q.nbind(fs.readFile, fs);

module.exports = {

  allAvailableMeals: function(req, res, next) {

    Meal.find({})
    .populate('_creator', 'displayName')
    .exec(function(err, meals) {
      if (err) { throw 'Err getting meals: ' + err }

      var available = meals.filter(function(meal) {
        return meal.date_available > new Date();
      })
      console.log(available);
      res.status(200).send(available);
    })
  },

  createMeal: function(req, res, next) {
    // var form = new multiparty.Form({
    //   autoFiles: true,
    //   uploadDir: '../images/'
    // });

    // form.on('error', function(err) {
    //   console.log('Error parsing form: ' + err.stack);
    // });

    // form.parse(req, function(err, fields, files) {

    //   Object.keys(fields).forEach(function(name) {
    //     console.log('Received field named ' + name);
    //   });

    //   Object.keys(files).forEach(function(name) {
    //     console.log('Received file named ' + name);
    //   });

    //   form.on('close', function() {
        User.findOne({ username: req.username })
        .then(function(user) {
          console.log(user);
          createMeal({
            imgUrl: req.body.imgUrl, // files.path[0], //
            description: req.body.decription, // fields.description[0], //
            title: req.body.title, // fields.title[0], //
            ingredients: req.body.ingredients, // fields.ingredients[0], // 
            _creator: user._id,
            date_available: req.body.date_available, //fields.date_available[0], //
            portions: req.body.portions, // fields.portions[0], //
            tags: req.body.tags // fields.tags[0] // 
          })
          .then(function(meal) {
            res.sendStatus(201);
          });
        })
    //   });
    // });
  },

  editMeal: function(req, res, next) { // TODO: Use update and update
    var meal_id = req.params.id;
    var updates = req.body;

    Meal.update({
      _id: meal_id
    }, updates, function() {
      res.sendStatus(200)
    });
  },

  deleteMeal: function(req, res, next) {

    var meal_id = req.params.id;
    var username = req.username; // TODO: return to taking from the token.

    User.findOne({ username: username })
    .then(function(user) {
      if (!user) {
        console.log('couldn\'t find user')
        res.sendStatus(404);
      }
      Meal.find({ _id: meal_id, _creator: user._id })
      .then(function(meal) {
        console.log('This is the meal requested to be deleted: ', meal);
        if (!meal) {
          res.sendStatus(404);
        }
        if (meal._creator !== user._id) {
          res.sendStatus(401);
        } else {
          if (meal.consumers.length === 0) {
            meal.remove();
            res.sendStatus(200);
          } else {
            User.find({ _id: { $in: meal.consumers } }, function(users) { // http://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
              users.forEach(function(user) {
                User.update(user, { $inc: { foodTokens : + 1 } }, function(err) {
                  if (err) { throw 'There was an error updating tokens after deleting a meal: ' + err; }
                })
              })
              meal.remove();
            });
          }
        }
      });
      
    })

  },

  userMeals: function(req, res, next) {

    var date = new Date();
    var userMeals = {};

    User.findOne({ username: req.username})
    .then(function(user) {
      console.log(user._id)
      Meal.find({ _creator: user._id })
      .populate('_creator', 'displayName')
      .populate('consumers', 'displayName')
      .exec(function(err, meals) {
        if (err) { throw 'There was an error fetching a user\'s created meals: ' + err; }
        if (meals.length > 0) {
          userMeals.created = {};
          meals.forEach(function(meal) {
            if (meal.date_available > date) {
              userMeals.created.current = userMeals.created.current || []; 
              userMeals.created.current.push(meal);
            } else {
              userMeals.created.past = userMeals.created.past || [];
              userMeals.created.past.push(meal);
            }
          });
        }
      })
      .then(function() {
        Meal.find({ consumers: user._id })
        .populate('_creator', 'displayName')
        .populate('consumers', 'displayName')
        .exec(function(err, meals) {
          if (err) { throw 'There was an error fetching a user\'s eating meals: ' + err; }
          if (meals.length > 0) {
            userMeals.consumed = {};
            meals.forEach(function(meal) {
              if (meal.date_available > date) {
                userMeals.consumed.current = userMeals.consumed.current || []; 
                userMeals.consumed.current.push(meal);
              } else {
                userMeals.consumed.past = userMeals.consumed.past || []; 
                userMeals.consumed.past.push(meal);
              }
            });
          }
          res.status(200).send(userMeals);
        });
      });
    });
  },

  addMealToUser: function(req, res, next) {
    // adds a selected meal the user's list of meals
    var meal_id = req.params.id;
    var username = req.username;

    User.findOne({ username: username })
    .then(function(user) {
      console.log(user);
      Meal.findOne({ _id: meal_id })
      .then(function(meal) {
        if (!meal) {
          res.sendStatus(404);
        }
        meal.consumers.push(user._id);
        meal.save(function() {
          res.sendStatus(200);
        });
      });
    });
  },

  deleteMealFromUser: function(req, res, next) {
    // removes a meal from the user's list of meals
    var meal_id = req.params.id;
    var username = req.username;

    User.findOne({ username: username })
    .then(function(user) {
      Meal.findOne({
        _id: meal_id,
        consumers: user._id
      })
      .then(function(meal) {
        if (meal) {
          console.log('Meal: ', meal)
          console.log('Consumers Array: ', meal.consumers)
          meal.consumers.pull(user._id);
          meal.save(function() {
            res.sendStatus(200);
          })
        } else {
          res.sendStatus(404);
        }
      })
    })
  }
};