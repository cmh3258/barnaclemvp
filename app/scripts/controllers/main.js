'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('MainCtrl', function ($scope, AccountService, $location) {

    $scope.isLoggedIn = false;

    AccountService.userLoginStatus().then(function(response){
      $scope.isLoggedIn = response;
    })
    
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
    }

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
    }

  });
