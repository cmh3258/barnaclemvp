'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:WriteupdateCtrl
 * @description
 * # WriteupdateCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('WriteupdateCtrl', function ($scope, $location, ReviewService) {
    
    $scope.finishedWriting = function(content){
      ReviewService.addTextToReview(content).then(function(response){
        console.log('finishedWriting response: ', response);
        if(response){
          alert('success');
          $location.path('/book');
        }
        else{
          alert('couldnt save your review');
        }
      })
    }

    $scope.skip = function(){
      $location.path('/profile');
    }


  });
