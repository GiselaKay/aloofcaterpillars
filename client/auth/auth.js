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
          $window.localStorage.setItem('com.oneApp', user.authToken);
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
        if(!user.error){
          $window.localStorage.setItem('com.oneApp', user.authToken)
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
    $location.path('/signin')
  };

  $scope.deleteAcc = function (password){
    // password should look like {password: "blah"}
    Auth.deleteAcc(password)
    .then(function (error){
      if(!error){
        $scope.signout();
        // SUCCESS
      }
      else {
        $scope.error = error;
      }
    })
  };

  $scope.isAuth = function (){
    Auth.isAuth().then(function (resp){
      if(resp){
        return true;
      }
      else{
        return false;
      }
    })
  }
});
