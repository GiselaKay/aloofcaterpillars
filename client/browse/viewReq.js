angular.module('viewReq', [])

.controller('viewCtrl', function($scope, Meals, $compile, $window, $location) {
  //TODO: we need to figure out current user and pass that in the get request
  if(!($window.localStorage.getItem('com.oneAppUser'))){
    $location.href = "#/signin";
  }
  // debugger;
  $scope.user = $window.localStorage.getItem('com.oneAppUser').toLowerCase();

  //Initialize variables
  $scope.pending = [];
  $scope.allData;
  $scope.activeUser = []
  $scope.activeMeals;
  $scope.tradeMeal = ''


  //Renders initial view. Filtered by creator's pending requests
  Meals.pendingReq().then(function(response) {
    var getData = response
    for (var i = 0; i<getData.length;i++) {
      if (getData[i].creator.toLowerCase() === $scope.user) {
        $scope.pending.push(getData[i])
      }
    }
  })


  //This code block was from StackOverflow
  //On click (or confirm trade), changes view via ng-if

  $scope.clicked = false;
  $scope.showHTML = false;

  var vm = this;
  this.handleButtonClick = handleButtonClick
  this.confirmTrade = confirmTrade

  init();

  function init(){
    $scope.showHTML = false;
  }

  

//On button click, getUserMeals
//EG. Jon receives a meal request from Joey
//on clicking "see Joey's meals", displays a new view that shows Joey's available meals for trade
  function handleButtonClick(meal){
    $scope.activeMeals = []
    Meals.getUserMeals().then(function(response) {
      var allData = response
      $scope.activeUser = meal.consumers[0];
      for (var i = 0; i < allData.length; i++) {
        if (allData[i].creator === $scope.activeUser) {
          $scope.activeMeals.push(allData[i])          
        }
      }
      $scope.tradeMeal = meal;
    }).then(function() { 
      $scope.showHTML = !$scope.showHTML;
    })
  }


//Confirms two ways
/*  1. Switches the status of both meals to "sold"
    2. Creator for Meal1 assigned to Meal2's consumer
    3. Vice versa
*/

  function confirmTrade(meal) {
    var sendReq = {
        meal1: {title: $scope.tradeMeal.title,
                creator: $scope.tradeMeal.creator},

        meal2: {title: meal.title,
                creator: meal.creator
              }
    }
    Meals.confirmReq(sendReq).then(function() {
      $location.path('/browse')
    })

  }
});
  









