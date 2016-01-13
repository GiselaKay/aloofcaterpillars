angular.module('create', [])

.controller('createCtrl', ['$scope', 'Meals', 'Upload', '$window', '$location', 'Auth', function($scope, Meals, Upload, $window, $location, Auth) {

  //Add meal via POST request from Meals factory
      console.log('MEAL CREATED', $location);
      // debugger;
    $scope.addMeal = function(meal) {
     
    var meal = meal;
    console.log(Upload)
    var creator = Auth.currentUser();

    meal.upload = Upload.upload({
      url: '/api/create',
      data: {meal: meal, creator: creator, title: $scope.meal.title, quantity: $scope.meal.quantity},
    });
    meal.upload.then(function (resp) {
      $location.path("/browse")
      });
    }

  //These button functions are activated when the user chooses from dropdown
    $scope.addProtein= function(ingredient, meal) {
      console.log('addProt')
      $scope.data.protein = ingredient.name
    }

     $scope.addRestrict= function(diet, meal) {
      console.log('restrict')
      $scope.data.diet = diet
    }
}])
