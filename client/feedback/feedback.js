angular.module('feedback', [])

.controller('feedbackController', function() {
  User.getMeals(uid)
  .then(function(meals) {
    var pastMeals = meals.created.past;
    var meals;

    if (pastMeals.length) {
      $scope.pastMeals = pastMeals.map(function(pastMeal) {
        var ratingAves = rateAve(pastMeal.feedback);

        return {
          imgUrl: pastMeal.imgUrl,
          meal_id: pastMeal.meal_id,
          title: pastMeal.title,
          date_available: pastMeal.date_available,
          ratings: ratingAves
        };
      });
    } else {
      $scope.pastMeals = [];
    }
  });

  var rateAve = function(feedbackArr) {
    var averages = [];
    var numFeedback = feedbackArr.length;

    if(!numFeedback) {
      return averages;
    }

    averages[0] = (Math.round((feedbackArr.reduce(function(a, b) {
      return a.ratingOne + b.ratingOne;
    })/numFeedback)*10))/10;
    averages[1] = (Math.round((feedbackArr.reduce(function(a, b) {
      return a.ratingTwo + b.ratingTwo;
    })/numFeedback)*10))/10;
    averages[2] = (Math.round((feedbackArr.reduce(function(a, b) {
      return a.ratingOne + b.ratingOne;
    })/numFeedback)*10))/10;

    return averages;
  };
});
