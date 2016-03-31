'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('MainCtrl', function ($scope, AccountService) {

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
            // $location.path('/main');
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
        if(response){
          $scope.$apply(function(){
            // $location.path('/main');
          })
        }
        else{
          alert('didnt log in!');
        }
      })
    }

  });
