angular.module('orders', ['ngMaterial', 'ngMessages'])

.controller('ordersController', function(Users) {
  Users.getMeals()
  .then(function(meals) {
    $scope.sharedMeals = meals.created.current.map(function(sharedMeal) {
      return {
        imgUrl: sharedMeal.imgUrl,
        title: sharedMeal.title,
        date_available: sharedMeal.date_available,
        num_portions: sharedMeal.consumers.length,
        requesters: sharedMeal.consumers.join(', ')
      };
    });

    $scope.nextMeals = meals.eating.current.map(function(nextMeal) {
      return {
        imgUrl: nextMeal.imgUrl,
        title: nextMeal.title,
        creator: nextMeal.creator,
        date_available: nextMeal.date_available
      };
    });
  });
});
