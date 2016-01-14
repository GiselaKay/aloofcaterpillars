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
      data: {creator: creator, date_available: data, description: description, ingredients: ingredients, portions: portions, quantity: $scope.meal.quantity, tags, tags, title: $scope.meal.title }
      //TODO: find out how to deal with picture & add fields in html
    });
    //{ imgUrl: String tags: Array }
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
