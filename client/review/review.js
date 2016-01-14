angular.module('review', ['ngMaterial', 'ngMessages'])

.controller('reviewController', function(Auth, Users) {
  Users.getMeals()
  .then(function(meals) {
    var needFeedback = [];
    meals.eating.past.forEach(function(meal) {
      var found = false;
      for (var i = 0; i < meal.feedback.length; i++) {
        if (meal.feedback[i].user_eater === Auth.currentUser) {
          found = true;
        }
      }
      if (!found) {
        meal.rating = {
          One: 3,
          Two: 3, 
          Three: 3
        };
        needFeedback.push(meal);
      }
    });
    $scope.needFeedback = needFeedback;
  });

  $scope.submitFeedback = function(meal) {
    var feedback = {
      meal_id: meal.meal_id,
      ratingOne: meal.rating.One,
      ratingTwo: meal.rating.Two,
      ratingThree: meal.rating.Three
    };
    Users.submitFeedback(feedback);
  };

});
