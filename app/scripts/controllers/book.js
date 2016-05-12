'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:BookCtrl
 * @description
 * # BookCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('BookCtrl', function ($scope, $location, $routeParams, ReviewService, AccountService, OrderService) {
  
    $scope.data = null;
    $scope.popUp = false;
    var reviewId = null;
    $scope.showForm = false;

    initial();

    function initial(){
      if('reviewId' in $routeParams){
        // console.log('routeParams: ', $routeParams.reviewId);
        reviewId = $routeParams.reviewId;
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

    $scope.doCheckout = function(token) {
      alert("Got Stripe token: " + token.id);
    };

    $scope.purchaseForm = function(show){
      $scope.showForm = show;
    }

    $scope.submitOrder = function(order){
      console.log('submitting order: ', order, reviewId);

      if(order === undefined){
        return false;
      }
      else if(order.name === undefined || order.name.length === 0){
        return false;
      }
      else if(order.address === undefined || order.address.length === 0){
        return false;
      }
      else{
        order.reviewId = reviewId;
        var orderId = OrderService.pushOrder(order);
        if(orderId){
          AccountService.addOrderIdToUser(orderId).then(function(response){
            alert('done adding order to user.');
            alert('response: ' + response);
            return 'done';
          })
        }
      }

    }

    

    

  });
