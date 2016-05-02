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

    $scope.buttonText = 'Get Started';

    $scope.getStarted = function(){
      $location.path('reflect');
    }

    initial();

    function initial(){
      if($window.localStorage.getItem('guestAccount')){
        $scope.buttonText = 'Reflect Now';
      }

    }


  });
