'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:WriteupdateCtrl
 * @description
 * # WriteupdateCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('WriteupdateCtrl', function ($scope, $timeout, $location, ReviewService) {
    
    $scope.finishedWriting = function(content, author){
      ReviewService.addTextToReview(content, author).then(function(response){
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

    if($scope.successBoxClose === undefined){
      console.log('in the und.');
      $timeout(function() {
        $scope.$apply(function(){
          $scope.successBoxClose = true;
          console.log('$scope.successBoxClose: ', $scope.successBoxClose);
        })
      }, 3000);
    }


  });
