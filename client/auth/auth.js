angular.module('auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.click = false;
  $scope.location = $location;
  
  //if you're coming from logout, destroy token

  $scope.clicked = function() {
    $scope.click = true;
  }

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.oneApp', token);
        $location.path('/browse');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signin = function () {
    console.log("sign in info", $scope.user)
    Auth.signin($scope.user)
      .then(function (token) {
        console.log(token)
        $window.localStorage.setItem('com.oneApp', token.token)
        $window.localStorage.setItem('com.oneAppUser', token.username);
        $window.localStorage.setItem('com.oneAppBalance', token.foodTokens);
        $location.path('/browse');
        // $scope.user = token.username;
        // console.log($scope.user);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  $scope.signout = function() {
    console.log('clicked')
    $window.localStorage.setItem('com.oneApp', {})
    $window.localStorage.setItem('com.oneAppUser', "")
    $location.path('/signin')
  };
});