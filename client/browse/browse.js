
angular.module('browse',['ngMaterial', 'ngMessages', 'factories', 'ngAnimate', 'fmp-card'])
.controller('browseCtrl',   function($scope, $window, Meals, Users, Auth, $mdDialog) {

  $scope.searchInput = '';

  //Pulls logged in user from localStorage
  $scope.activeUser = $window.localStorage.getItem('com.oneAppUser');

  $scope.search = function (meal) {
    // return angular.lowercase(meal.title).indexOf($scope.searchInput || '') !== -1;

    // enable when server returns meals with this information
    return (
      angular.lowercase(meal.title).indexOf($scope.searchInput || '') !== -1 ||
      angular.lowercase(meal.description).indexOf($scope.searchInput || '') !== -1||
      angular.lowercase(meal.tags).indexOf($scope.searchInput || '') !== -1||
      angular.lowercase(meal.ingredients).indexOf($scope.searchInput || '') !== -1||
      angular.lowercase(meal.creator).indexOf($scope.searchInput || '') !== -1);
  };

  $scope.data;
  $scope.browseMeals = [];

  Users.getUserInfo().then(function (user){
    return user.displayName;
  }).then(function (displayName){
    Meals.getAllMeals().then(function(data){
      $scope.browseMeals = data.data.map(function(datum) {
        datum.ingredients.length ? datum.ingredients = datum.ingredients.join(', ') : datum.ingredients = 'Not Available';
        datum.tags.length ? datum.tags = datum.tags.join(', ') : datum.tags = 'None/Not Available';

        return datum;
      })
      .filter(function(datum) {

        return datum._creator.displayName !== displayName;
      });
    });
  })


  var mealController = function($scope, $mdDialog, meal) {
    $scope.meal = meal;

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.close = function() {
      $mdDialog.cancel();
    };
    $scope.requestMeal = function(request) {
      $mdDialog.hide(true)
    };
  };

  $scope.showMeal = function(event, meal) {
    $mdDialog.show({
      controller: mealController,
      templateUrl: 'browse/meal.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: {
        meal: meal
      }
    })
    .then(function(request) {
      if (request) {
        $scope.requestMeal(meal);
      }
    });
  };

  $scope.requestMeal = function(meal) {
    meal.hide = true;
    Users.buyMeal(meal._id)
    .then(function(data) {
      console.log('meal requested')
    });
  };
});
