'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('ProfileCtrl', function ($scope, SocialService) {
    
    //if already connected with X wont need to connect to it again! *******

    $scope.socialStatus = {
      twitter: null,
      instagram: null,
      wordpress: null
    }
    $scope.hasOneConnected = false;
    $scope.timeline = [];

    initial();

    function initial(){
      
      $scope.socialStatus = SocialService.checkSocialStatus();

    }


    $scope.connectSocial = function(site){
      SocialService.connectSocial(site);
    };


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
        console.log('ctrl loadTimeline response: ', response);
        $scope.timeline = response;
      })
    };


    

    //instagram
    

  });
