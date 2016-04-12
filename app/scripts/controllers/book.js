'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:BookCtrl
 * @description
 * # BookCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('BookCtrl', function ($scope, $location, ReviewService) {
  
    $scope.data = null;

    ReviewService.viewCurrentReview().then(function(response){
      console.log('current review: ', response);
      if(!response){
        $location.path('/profile');
      }
      else{
        $scope.data = response;

      }
    })

  });
