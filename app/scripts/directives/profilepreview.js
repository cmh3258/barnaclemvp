'use strict';

/**
 * @ngdoc directive
 * @name barnacleMvpApp.directive:profilepreview
 * @description
 * # profilepreview
 */
angular.module('barnacleMvpApp')
  .directive('profilepreview', function ($window) {
    return {
      templateUrl: 'views/profilepreview.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the profilepreview directive');
      },
      controller: function($scope, AccountService){

        $scope.isLoggedIn = false;

        initial();

        function initial(){

          if($window.localStorage.getItem('guestAccount')){
          // $scope.$apply(function(){
              $scope.isLoggedIn = {displayName:'Guest'};
            // })
          }
          else{
            AccountService.userLoginStatus().then(function(response){
              console.log('response: ', response);
              if(response){
                try{
                  console.log('yes, logged in. ', response.val().displayName);
                }catch(e){}
              
                if(!$scope.$$phase) {
                  $scope.$apply(function(){
                    $scope.isLoggedIn = response.val();
                  })
                }
                else{
                  $scope.isLoggedIn = response.val();
                }
              }

            })
          }
        }

        $scope.fbLogin = function(){
      // loadingIndicator(true);
      AccountService.loginFacebook().then(function(response){

        console.log('[loginFacebook] response: ', response);

        // loadingIndicator(false);
        /*if(response){
          $scope.$apply(function(){
            $location.path('/profile');
          })
        }
        else{
          alert('didnt log in!');
        }*/
      })
    };

    $scope.twitterLogin = function(){
      // loadingIndicator(true);
      AccountService.loginTwitter().then(function(response){
        // loadingIndicator(false);
        console.log('[twitterLogin] response: ', response, response.val());
        if(response){
          if(!$scope.$$phase) {
            $scope.$apply(function(){
              $scope.isLoggedIn = response;//response.val();
            })
          }
          else{
            $scope.isLoggedIn = response;//response.val();
          }
        }

        /*if(response){
          $scope.$apply(function(){
            $location.path('/profile');
          })
        }
        else{
          alert('didnt log in!');
        }*/
      })
    };

    $scope.guestLogin = function(){
      var path = AccountService.guestAccount();
      try{
        console.log('[guestLogin] path: ', path.toString()); //save this to localStorage so user can access again later
        $window.localStorage.setItem('guestAccount', path.toString());
      }
      catch(e){
        alert('issue using a guest account.');
      }
    };

    $scope.logoutGuest = function(){
      $window.localStorage.removeItem('guestAccount');
      $scope.isLoggedIn = false;
    }

    $scope.logout = function(){
      AccountService.unAuth();
      $scope.isLoggedIn = false;
    }


      }
    };
  });
