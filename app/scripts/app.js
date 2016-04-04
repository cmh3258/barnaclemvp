'use strict';

/**
 * @ngdoc overview
 * @name barnacleMvpApp
 * @description
 * # barnacleMvpApp
 *
 * Main module of the application.
 */
angular
  .module('barnacleMvpApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'oauthio'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })


  .run(function (AccountService, $location, $rootScope){

      OAuth.initialize('inhBe05zh9VuRPBiHIzBEyBNY-M');

      console.log('run!', $location.path());

      AccountService.userLoginStatus().then(function(response){
        console.log('userLoginStatus: ', response);
        if(response === false || response.val() == null){
          $location.path('/main');
        }
        else{
          // $location.path('/profile');

          // var path = $location.url();
          // if(path === '/' || path === '/login' || path === '/postcomplete'){
          //   $rootScope.$apply(function() {
          //     // $location.path('/landing');
          //     $location.path('/main/write');
          //   })
          // }
          // console.log('can stay, we logged in.');
        }
      })

  });

