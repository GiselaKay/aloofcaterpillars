angular.module('dashboard', ['ngMaterial', 'ngMessages'])

.controller('dashController', function(Users) {
  $scope.tokenBalance = Users.getBalance();

  Users.getMeals()
  .then(function(meals) {
    if (meals.eating.current.length) {
      $scope.nextMeal = meals.eating.current[0];
    } else {
      $scope.nextMeal = {
        imgUrl: '', // need address of default image
        title: 'We don\'t know yet!',
        creator: 'a friend',
        date_available: 'Sometime soon, we hope'
      };
    }

    if (meals.created.current.length) {
      $scope.nextOffer = meals.created.current[0];
    } else {
      $scope.nextOffer = {
        imgUrl: '' // need address of default image
        title: 'Share a meal with someone',
        date_available: 'Sometime soon, we hope'
        portions: 'Lots!'
      };
    }

    if (meals.created.past.length) {
      var randIdx = Math.floor(Math.random()*meals.created.past.length);
      $scope.oneFeedback = meals.created.past[randIdx];
    } else {
      $scope.oneFeedback = {
        title: 'Share a meal with someone',
        overall: 'They\'ll love it!'
      };
    }
  });
});
