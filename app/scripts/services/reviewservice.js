'use strict';

/**
 * @ngdoc service
 * @name barnacleMvpApp.reviewservice
 * @description
 * # reviewservice
 * Factory in the barnacleMvpApp.
 */
angular.module('barnacleMvpApp')
  .factory('ReviewService', function ($q, $window) {
    // Service logic
    // ...

    var currentToken = null;
    var review 
    var reviewRef = new Firebase("https://barnacle-mvp.firebaseio.com/reviews");

    initial();

    function initial(){
      if($window.localStorage.getItem('currentPostToken')){
        currentToken = $window.localStorage.getItem('currentPostToken');
      }
    }

    function getMonthName(num){
      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[num];
    }


    // Public API here
    return {
      saveReview: function (review) {
        if(review !== null && review.length !== 0){
          var date = new Date();
          var title = getMonthName((new Date()).getMonth()) + ' Review';
          var finalReview = {posts: review, text: '', date:date.toISOString(), title:title};
          var reviewId = reviewRef.push(finalReview);
          currentToken = reviewId.name(); //take this token and save to the user object
          $window.localStorage.setItem('currentPostToken', currentToken);
          return currentToken;
        }
        else{
          return false;
        }

      },
      addTextToReview: function(text, author){
        var defer = $q.defer();
        var reviewRef = new Firebase("https://barnacle-mvp.firebaseio.com/reviews/"+currentToken);

        reviewRef.once("value", function(snapshot) {
          var review = snapshot.val();
          review.text = text;
          review.author = author;
          
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
      },
      viewCurrentReview: function(){
        var defer = $q.defer();
        if(currentToken === null){
          defer.resolve(false);
        }
        else{
          var reviewRef = new Firebase("https://barnacle-mvp.firebaseio.com/reviews/"+currentToken);
          reviewRef.once("value", function(snapshot) {
            var review = snapshot.val();
            defer.resolve(review);
          })
        }
        return defer.promise;
      },
      viewCurrentReviewWToken: function(token){
        var defer = $q.defer();
        if(token === null){
          defer.resolve(false);
        }
        else{
          var reviewRef = new Firebase("https://barnacle-mvp.firebaseio.com/reviews/"+token);
          reviewRef.once("value", function(snapshot) {
            var review = snapshot.val();
            defer.resolve(review);
          })
        }
        return defer.promise;
      },
      setCurrentReviewToken: function(token){
        $window.localStorage.setItem('currentPostToken', token);
        currentToken = token;
      }
    };
  });
