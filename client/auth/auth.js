angular.module('auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.inUser = {}; // signedIn
  $scope.click = false;
  $scope.location = $location;

  //if you're coming from logout, destroy token

  $scope.clicked = function() {
    $scope.click = true;
  }

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (user) {
        if(!user.error){
          $window.localStorage.setItem('com.oneApp', user.token);
          $window.localStorage.setItem('com.oneAppID', user.id);
          $location.path('/browse');
        }
        else{
          $scope.error = user.error;
        }

      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (user) {

        $window.localStorage.setItem('com.oneApp', user.authToken)
        $window.localStorage.setItem('com.oneAppUser', user.username);
        $window.localStorage.setItem('com.oneAppBalance', user.foodTokens);
        $location.path('/browse');

        if(!user.error){
          $window.localStorage.setItem('com.oneApp', user.authToken)
          $window.localStorage.setItem('com.oneAppID', user.id);
          $scope.username = user.name;
          $scope.lunchboxes = user.foodTokens;
          $location.path('/browse');
        }
        else{
          $scope.error = user.error;
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  $scope.signout = function() {

    $window.localStorage.removeItem('com.oneApp')
    $window.localStorage.removeItem('com.oneAppUser')
    $window.localStorage.removeItem('com.oneAppBalance')
    
    $location.path('/signin')
  };
});
