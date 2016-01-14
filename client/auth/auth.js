angular.module('auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.click = false;

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
        // Auth.currentUser()
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signin = function () {
    console.log("sign in info", $scope.user)
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.oneApp', token.token)
        $window.localStorage.setItem('com.oneAppID', token.id);
        $location.path('/browse');
        $scope.user = token.username;
        console.log($scope.user);
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
