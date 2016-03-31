'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
