angular.module('create', [])

.controller('createCtrl', ['$scope', '$location', 'Meals', 'Upload', 'Auth', '$base64', '$window', function($scope, $location, Meals, Upload, Auth) {

    $scope.meal = {
      title: '',
      description: '',
      picture: '',
      ingredients: 'Not available',
      tags: 'Not available',
      portions: 0,
      date_available: ''
    };

    $scope.ingredients = {
      meat: ['Chicken', 'Beef', 'Pork', 'Fish', 'Other'],
      other: ['Veggies', 'Tofu', 'Rice', 'Pasta', 'Bread']
    };

    $scope.restrictions = ['Vegetarian', 'Vegan', 'Low-Carb', 'Gluten-Free'];

    $scope.myDate = new Date();
    $scope.minDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth(),
      $scope.myDate.getDate() + 2);
    $scope.maxDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() + 1,
      $scope.myDate.getDate());
  //Add meal via POST request from Meals factory
      console.log('MEAL CREATED', $location);
      // debugger;
    $scope.addMeal = function(meal) {

      Upload.upload({
        url: '/boorish/meals',
        data: $scope.meal,
      })
      .then(function(res) {
        $location.path('/browse')
      });
    };

  //These button functions are activated when the user chooses from dropdown
    $scope.addIngred = function(ingredient) {
      if ($scope.meal.ingredients === 'Not available') {
        $scope.meal.ingredients = ingredient;
      } else {
        $scope.meal.ingredients += ', ' + ingredient;
      }
    }

     $scope.addRestrict = function(tag) {
      if ($scope.meal.tag === 'Not available') {
        $scope.meal.tag = tag;
      } else {
        $scope.meal.tag += ', ' + tag;
      }
    }

    $scope.emptyCheck = function() {
      return $scope.meal.title && $scope.meal.description && $scope.meal.portions && $scope.meal.date_available;
    };
}])
