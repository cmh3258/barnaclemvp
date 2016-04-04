'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('MainCtrl', function ($scope, AccountService, $location, $window) {

    $scope.isLoggedIn = false;

    initial();

    function initial(){
      if($window.localStorage.getItem('guestAccount')){
        $scope.isLoggedIn = 'guest account';
      }
      else{
        AccountService.userLoginStatus().then(function(response){
          console.log('yes, logged in.');
          $scope.$apply(function(){
                 // $location.path('/profile');
          $scope.isLoggedIn = response;
                 
               })

        })    
      }
    }

    
    
    $scope.fbLogin = function(){
      // loadingIndicator(true);
      AccountService.loginFacebook().then(function(response){
        // loadingIndicator(false);
        if(response){
          $scope.$apply(function(){
            $location.path('/profile');
          })
        }
        else{
          alert('didnt log in!');
        }
      })
    };

    $scope.twitterLogin = function(){
      // loadingIndicator(true);
      AccountService.loginTwitter().then(function(response){
        // loadingIndicator(false);
        console.log('[twitterLogin] response: ', response);
        if(response){
          $scope.$apply(function(){
            $location.path('/profile');
          })
        }
        else{
          alert('didnt log in!');
        }
      })
    };

    $scope.guestLogin = function(){
      var path = AccountService.guestAccount();
      console.log('[guestLogin] path: ', path.toString()); //save this to localStorage so user can access again later
      $window.localStorage.setItem('guestAccount', path.toString());
    };

    $scope.logoutGuest = function(){
      $window.localStorage.removeItem('guestAccount');
      $scope.isLoggedIn = false;
    }

  });
