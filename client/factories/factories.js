angular.module('factories', ['ngMaterial', 'ngMessages'])

.factory('Meals', function($http) {

//Right now, all categories of primary ingredient are hard-coded here.
//TODO: move categories to database
  var ingredients = [
      { ingredient: 'meat', name: 'Chicken' },
      { ingredient: 'meat', name: 'Beef' },
      { ingredient: 'meat', name: 'Pork' },
      { ingredient: 'meat', name: 'Bacon' },
      { ingredient: 'veg', name: 'Eggs' },
      { ingredient: 'veg', name: 'Beans' },
      { ingredient: 'veg', name: 'Tofu' },
      { ingredient: 'veg', name: 'Grass' }
    ];

  var restrictions = [
    'None', 'Vegetarian', 'Paleo',  'Gluten-Free', 'Low-Carb'
  ]

  var storeMeal = function(meal) {
    return $http({
      method: 'POST',
      url: '/api/create',
      data: meal
    })
    .then(function(resp) {
      return resp.data
      console.log('meal is stored')
    })
  }

//Standard GET for all meals
  var getAllMeals = function() {
    return $http({
      method:'GET',
      url:'/api/browse'
    }).success(function(resp){
      return resp.data;
    }).error(function(){
      alert('error');
    })
  }

//Changes food status to pending
  var makeReq = function(req) {
    return $http({
      method: 'PUT',
      url: 'api/makerequest',
      data: req
    }).then(function(resp) {
      return resp.data
    })
  }


//See below comment on GET
  var getUserMeals = function(userMeals) {
    return $http({
      method: 'GET',
      url: 'api/usermeals',
      data: userMeals
    }).then(function(resp) {
      return resp.data
    })
  }


//Views pending requests. Passes a username

//Note: GET requests as I know it don't have the username in the req.body
//Therefore, filtering happened on front end. This is basically a normal GET
  var pendingReq = function(user) {
    return $http({
      method: 'GET',
      url: 'api/viewpending',
    }).then(function(resp) {
      return resp.data
    })
  }


//Confirms request from View Request Screen
  var confirmReq = function(meal) {
    return $http({
      method: 'PUT',
      url: 'api/confirmrequest',
      data: meal
    }).then(function(resp) {
      return resp.data
    })
  }

//This one isn't used yet
  var searchByIngredient = function(ingredient){
    return $http({
      method: 'POST',
      url: 'api/getingredient',
      data: ingredient
    }).then(function(resp){
      return resp.data
    })
  }

  return {
    storeMeal: storeMeal,
    ingredients: ingredients,
    restrictions: restrictions,
    getAllMeals: getAllMeals,
    getUserMeals: getUserMeals,
    confirmReq: confirmReq,
    makeReq: makeReq,
    pendingReq: pendingReq,
    searchByIngredient: searchByIngredient,
  }
})
.factory('Auth', function($http, $location, $window) {
    // Don't touch this Auth service!!!
    // it is responsible for authenticating our user
    // by exchanging the user's username and password
    // for a JWT from the server
    // that JWT is then stored in localStorage as 'com.shortly'
    // after you signin/signup open devtools, click resources,
    // then localStorage and you'll see your token from the server
    var signin = function(user) {
      return $http({
          method: 'POST',
          url: '/api/signin',
          data: user
        })
        .then(function(resp) {
          console.log(resp)
          return resp.data;
        });
    };

    var signup = function(user) {

      return $http({
          method: 'POST',
          url: '/boorish/users',
          data: user
        })
        .then(function(resp) {
          var user = {error: null, id: resp.data.id, token: resp.data.authToken}
          if (resp.status === 200) {
            return user;
          }
          else if (resp.status === 409) {
            user.error = "Username already exists"
          }
          else {
            user.error = "Unknown Error";
          }
          return user;
        });
    };

    var isAuth = function() {
      console.log('Checking Authentication')
      return !!$window.localStorage.getItem('com.oneApp');
    };

    var signout = function() {
      $window.localStorage.removeItem('com.oneApp');
      $location.path('/signin');
    };

    var currentUser = function() {
      var userID = $window.localStorage.getItem('com.oneAppID');
      $http({
        method: 'GET',
        url: '/boorish/users/' + userID
      }).then(function (resp){
        return resp;
      })
      // return $window.localStorage.getItem('com.oneAppID');
    };
    return {
      signin: signin,
      signup: signup,
      isAuth: isAuth,
      signout: signout,
      currentUser: currentUser
    };
  })
  .factory('activity', function ($http){
    var getHomePageData = function (){
      var userID = $window.localStorage.getItem('com.oneAppID');
      $http({
        method: 'GET',
        url: '/boorish/meals/users/' + userID
      }).then(function(resp){
        $scope.currentEating = resp.data.eating.current;
        $scope.currentCreated = resp.data.created.current;
        $scope.pastEating = resp.data.eating.past;
        $scope.pastCreated = resp.data.created.past;
      })
    }
  })
  .factory('userData', function ($http){

  })
