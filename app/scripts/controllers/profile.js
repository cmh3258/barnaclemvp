'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('ProfileCtrl', function ($scope) {
    
    //if already connected with X wont need to connect to it again! *******



    function twitterConnect(){
      //Example with Twitter with the cache option enabled
      OAuth.popup('twitter', {cache: true}).done(function(twitter) {
        //make API calls with `twitter`
      }).fail(function(err) {
        //todo when the OAuth flow failed
      })
    }

    //instagram
    

  });
