angular.module('factories', ['ngMaterial', 'ngMessages'])

.factory('Meals', function($http) {

//Right now, all categories of primary ingredient are hard-coded here.
//TODO: move categories to database
  // var ingredients = [
  //     { ingredient: 'meat', name: 'Chicken' },
  //     { ingredient: 'meat', name: 'Beef' },
  //     { ingredient: 'meat', name: 'Pork' },
  //     { ingredient: 'meat', name: 'Bacon' },
  //     { ingredient: 'veg', name: 'Eggs' },
  //     { ingredient: 'veg', name: 'Beans' },
  //     { ingredient: 'veg', name: 'Tofu' },
  //     { ingredient: 'veg', name: 'Grass' }
  //   ];

  // var restrictions = [
  //   'None', 'Vegetarian', 'Paleo',  'Gluten-Free', 'Low-Carb'
  // ]

  var storeMeal = function(meal) {
    //TODO: Switch to addMeal
    return $http({
      method: 'POST',
      url: '/boorish/meals',
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
      method: 'GET',
      url: '/boorish/meals'
    }).then(function(resp){
      if(typeof resp.data === 'object'){
        var arr = [];
        arr.push(resp.data)
        return arr;
      }
      return resp.data;
    })
  }

  var retrieveTags = function (){
    return $http({
      method: 'GET',
      url: '/boorish/tags'
    }).then(function (resp){
      return resp;
    })
  }
//Changes food status to pending
  // var makeReq = function(req) {
  //   return $http({
  //     method: 'PUT',
  //     url: 'api/makerequest',
  //     data: req
  //   }).then(function(resp) {
  //     return resp.data
  //   })
  // }


//See below comment on GET
  // var getUserMeals = function(userMeals) {
  //   return $http({
  //     method: 'GET',
  //     url: 'api/usermeals',
  //     data: userMeals
  //   }).then(function(resp) {
  //     return resp.data
  //   })
  // }


//Views pending requests. Passes a username

//Note: GET requests as I know it don't have the username in the req.body
//Therefore, filtering happened on front end. This is basically a normal GET
  // var pendingReq = function(user) {
  //   return $http({
  //     method: 'GET',
  //     url: 'api/viewpending',
  //   }).then(function(resp) {
  //     return resp.data
  //   })
  // }


//Confirms request from View Request Screen
  // var confirmReq = function(meal) {
  //   return $http({
  //     method: 'PUT',
  //     url: 'api/confirmrequest',
  //     data: meal
  //   }).then(function(resp) {
  //     return resp.data
  //   })
  // }

//This one isn't used yet
  // var searchByIngredient = function(ingredient){
  //   return $http({
  //     method: 'POST',
  //     url: 'api/getingredient',
  //     data: ingredient
  //   }).then(function(resp){
  //     return resp.data
  //   })
  // }

  return {
    storeMeal: storeMeal,
    getAllMeals: getAllMeals
    // getUserMeals: getUserMeals,
    // confirmReq: confirmReq,
    // makeReq: makeReq,
    // pendingReq: pendingReq,
    // searchByIngredient: searchByIngredient,
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

    var authorized = function (status, situation){
      if (status === 200) {
        return null;
      }
      else if (status === 401){
        if(situation === "signIn"){
          return "Wrong Password";
        }
        else if (situation === "checkAuth") {
          return "Not Logged In";
        }
      }
      else if (status === 403){
        if(situation == "signUp"){
          return "Username Already Exists";
        }
      }
      else {
        return "Unknown Error";
      }
    }

    var signin = function(signingUser) {
      return $http({
          method: 'POST',
          url: '/boorish/users/signin',
          data: signingUser
        })
        .then(function(resp) {
          var signedInUser = {error: authorized(resp.status, "signIn"), token: resp.data.token};
          return signedInUser;
        }, function (resp){
          var error = {error: authorized(resp.status, "signIn")};
          return error;
        });
    };

    var signup = function(user) {
      return $http({
          method: 'POST',
          url: '/boorish/users',
          data: user
        })
        .then(function(resp) {
          var user = {error: authorized(resp.status, "signUp"), token: resp.data.token}
          return user;
        }, function (resp){
          var error = {error: authorized(resp.status, "signUp")};
          return error;
        });

    };

    var isAuth = function() {

      return $http({
        method: 'GET',
        url: '/boorish/users/signedin'
      }).then(function (resp){
        return authorized(resp.status, "checkAuth") === null;

      }).then(function (resp){
        return false;
      })
      // return !!$window.localStorage.getItem('com.oneApp');
    };

    var deleteAcc = function (password){
      return $http({
        method: 'DELETE',
        url: '/boorish/users/',
        data: password
      }).then (function (resp){
        return authorized(resp.status, "deleteAcc") === null;
      })

    }
    // var signout = function() {
    //   $window.localStorage.removeItem('com.oneApp');
    //   $location.path('/signin');
    // };
    //
    // var currentUser = function() {
    //   var userID = $window.localStorage.getItem('com.oneAppID');
    //   $http({
    //     method: 'GET',
    //     url: '/boorish/users/' + userID
    //   }).then(function (resp){
    //     return resp;
    //   })
    //   // return $window.localStorage.getItem('com.oneAppID');
    // };
    return {
      signin: signin,
      signup: signup,
      isAuth: isAuth,
      deleteAcc: deleteAcc
    };
  })
  .factory('Users', function ($http){
    var userData = null;

    var getMeals = function (){
      return $http({
        method: "GET",
        url: '/boorish/meals/users/'
      }).then(function (resp){
        var userMeals = {};

        if(resp.data.consumed){
          userMeals.eating = {
            current: resp.data.consumed.current,
            past: resp.data.consumed.past
          }
        }
        else{
          userMeals.eating = {
            current: [],
            past: []
          }
        }
        if(resp.data.created){
          userMeals.created = {
            current: resp.data.created.current,
            past: resp.data.created.past
          }
        }
        else{
          userMeals.created = {
            current: [],
            past: []
          }
        }
        return userMeals;
      })
    };

    var getUserInfo = function (){
      // if(userData){
      //   return userData;
      // } else{
        return $http({
          method: "GET",
          url: '/boorish/users/'
        }).then(function (resp){
          userData = {
            lunchboxes: resp.data.foodTokens,
            rating: resp.data.rating,
            displayName: resp.data.displayName,
            id: resp.data.id
          };
          return userData;
        })
      // }

    };

    // var getUserInfo = function (){
    //   debugger;
    //   if (userData){
    //     console.log("1")
    //     return userData;
    //   }
    //   else {
    //     console.log("setUser:",setUserInfo())
    //   //  return setUserInfo().then( function (newData){
    //   //    userData = newData;
    //   //   //  console.log(userData.constructor);
    //   //     return userData;
    //   //   })
    //   }
    // };

    var buyMeal = function (mid){
      return $http({
        method: "POST",
        url:  '/boorish/meals/users/' + mid
      }).then(function (mid){
        return mid;
      })
    };

    var editMeal = function (mid, changes){
      return $http({
        method: 'PUT',
        url: '/boorish/meals/' + mid,
        data: changes
      }).then(function (mid, changes){
        return changes;
      })
    };

    var returnMeal = function (mid){
      $http({
        method: 'PUT',
        url: '/boorish/meals/users/' + mid
      })
    };

    var cancelMeal = function (mid){
      $http({
        method: "DELETE",
        url:  '/boorish/meals/:id' + mid
      })
    };

    return {
      getMeals: getMeals,
      buyMeal: buyMeal,
      editMeal: editMeal,
      getUserInfo: getUserInfo,
      returnMeal: returnMeal
      // getUserMeals: getUserMeals,
      // confirmReq: confirmReq,
      // makeReq: makeReq,
      // pendingReq: pendingReq,
      // searchByIngredient: searchByIngredient,
    }
  })
  .factory('Feedback', function ($http){

    var submitFeedback = function (mid ,feedback){

      $http({
        method: "POST",
        url: '/boorish/feedback/meals/' + mid,
        data: feedback
      });

    };

    var retrieveFeedBack = function (mid){

      $http({
        method: "GET",
        url: "/boorish/feedback/meals/" + mid
      }).then( function (resp){
        return resp.data;
      })
    };

    var editFeedback = function (changes){

    $http({
      method: "PUT",
      url: "/boorish/feedback/meals/" + mid,
      data: changes
    })
  }

    return {
      submitFeedback: submitFeedback,
      retrieveFeedBack: retrieveFeedBack,
      editFeedback: editFeedback
    }
    // var retrieveFeedBack = function (){
    //   return $http({
    //     method: "GET",
    //     url: '/boorish/feedback/meals/' + feedbac
    //   })
    // }

  });
