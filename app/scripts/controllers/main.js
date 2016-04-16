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

    $scope.getStarted = function(){
      $location.path('reflect');
    }

  });
