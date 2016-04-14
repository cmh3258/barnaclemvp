'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('ProfileCtrl', function ($scope, $location, SocialService, ReviewService, AccountService) {
    
    //if already connected with X wont need to connect to it again! *******

    $scope.userData = null;

    initial();

    function initial(){
      
      $scope.socialStatus = SocialService.checkSocialStatus();
      AccountService.getUserInfo().then(function(response){
        console.log('updated user info: ', response);
        $scope.userData = response;
        if(response === null){
          $location.path('/');
        }
      });
    }


    $scope.connectSocial = function(site){
      SocialService.connectSocial(site).then(function(response){
        console.log('frontent connectSocial: ', response);
        $scope.socialStatus = response;
      })
    };



  });
