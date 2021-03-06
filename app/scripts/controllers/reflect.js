'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:ReflectCtrl
 * @description
 * # ReflectCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('ReflectCtrl', function ($scope, $location, SocialService, ReviewService, AccountService) {
    
    $scope.socialStatus = {
      twitter: null,
      instagram: null,
      wordpress: null
    }
    $scope.hasOneConnected = false;
    $scope.timeline = [];
    $scope.step = 1;
    $scope.userData = null;

    initial();

    function initial(){
      $scope.socialStatus = SocialService.checkSocialStatus();
      AccountService.getUserInfo().then(function(response){
        $scope.userData = response;
      });
    }


    $scope.connectSocial = function(site){
      SocialService.connectSocial(site).then(function(response){
        // console.log('frontent connectSocial: ', response);
        $scope.socialStatus = response;
      })
    };

    $scope.disconnectSocial = function(serviceName){
      OAuth.clearCache(serviceName);
      $scope.socialStatus[serviceName] = null;
    }


    // $scope.$watch(function(){
    //   return $scope.socialStatus;
    // },function(newValue){
    // })

    $scope.hasOneConnected = function(){
      for (var key in $scope.socialStatus) {
        if($scope.socialStatus[key]){
          return true;
        }
      }
      return false;
    };


    $scope.loadTimeline = function(){
      SocialService.loadTimeline().then(function(response){
        // console.log('ctrl loadTimeline response: ', response);
        $scope.timeline = response;
      })
    };

    $scope.saveTimeline = function(){
      console.log('saving : ', $scope.timeline);
      var posts = $scope.timeline;
      var finalPosts = [];
      for(var i=0; i < posts.length; i++){
        if(posts[i].isIncluded){
          finalPosts.push(posts[i]);
        }
      }

      // console.log('saving final posts: ', finalPosts);
      var posts1 = angular.copy(finalPosts);
      // console.log('posts1: ', posts1);
      var token = ReviewService.saveReview(posts1);
      if(token){
        // console.log('saved revievw! : ', token);
        AccountService.updateUserReviews(token).then(function(response){
          // console.log('hi: ', response);          
          if(response){
            // alert('success');
            $location.path('/writeupdate');
          }
          else{
            alert('couldnt save your review');
          }
        })
      }
      else{
        console.log('BAD saved revievw: ', token);
      }
    }


    $scope.viewReview = function(reviewId){
      // ReviewService.setCurrentReviewToken(reviewId);
      $location.path('/book/'+reviewId);
    }


    $scope.canSave = function(){
      var posts = $scope.timeline;
      for(var i=0; i < posts.length; i++){
        if(posts[i].isIncluded){
          return true;
        }
      }

      return false;
    }


    $scope.disconnectSocial = function(){
      SocialService.disconnect();
      $scope.socialStatus = {
        twitter: null,
        instagram: null,
        wordpress: null
      }
    }
  });
