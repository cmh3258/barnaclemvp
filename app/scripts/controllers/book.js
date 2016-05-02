'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:BookCtrl
 * @description
 * # BookCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('BookCtrl', function ($scope, $location, $routeParams, ReviewService, AccountService) {
  
    $scope.data = null;
    $scope.popUp = false;

    initial();

    function initial(){
      if('reviewId' in $routeParams){
        console.log('routeParams: ', $routeParams.reviewId);
        ReviewService.viewCurrentReviewWToken($routeParams.reviewId).then(function(response){
          console.log('current review: ', response);

          console.log('is owner of post: ', AccountService.userOwnsReview($routeParams.reviewId));

          if(!response){
            $location.path('/reflect');
          }
          else{
            $scope.data = response;
          }
        })
      }
      else{
        loadReview();
      }
    }

    function loadReview(){
      ReviewService.viewCurrentReview().then(function(response){
        console.log('current review: ', response);
        if(!response){
          $location.path('/reflect');
        }
        else{
          $scope.data = response;

        }
      })
    }

    $scope.closeModal = function(){
      $scope.popUp = false;
    }

    

    

  });
