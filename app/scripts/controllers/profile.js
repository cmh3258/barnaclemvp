'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('ProfileCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
