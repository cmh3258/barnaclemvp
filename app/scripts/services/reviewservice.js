'use strict';

/**
 * @ngdoc service
 * @name barnacleMvpApp.reviewservice
 * @description
 * # reviewservice
 * Factory in the barnacleMvpApp.
 */
angular.module('barnacleMvpApp')
  .factory('ReviewService', function ($q) {
    // Service logic
    // ...

    var currentToken = null;

    var reviewRef = new Firebase("https://barnacle-mvp.firebaseio.com/reviews");


    // Public API here
    return {
      saveReview: function (review) {

        if(review !== null && review.length !== 0){
          var date = new Date();
          var finalReview = {posts: review, text: '', date:date.toISOString()}
          var reviewId = reviewRef.push(finalReview);
          currentToken = reviewId.name(); //take this token and save to the user object
          return currentToken;
        }
        else{
          return false;
        }

      },
      addTextToReview: function(text){
        var defer = $q.defer();
        var reviewRef = new Firebase("https://barnacle-mvp.firebaseio.com/reviews/"+currentToken);

        reviewRef.once("value", function(snapshot) {
          var review = snapshot.val();
          review.text = text;
          
          reviewRef.update(review, function(error){
            if (error) {
              console.log('Synchronization failed');
              defer.resolve(false);
            } else {
              console.log('Synchronization succeeded');
              defer.resolve(true);
            }
          });
        })

        return defer.promise;
      }
    };
  });
