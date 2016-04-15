'use strict';

/**
 * @ngdoc service
 * @name barnacleMvpApp.accountservice
 * @description
 * # accountservice
 * Factory in the barnacleMvpApp.
 */
angular.module('barnacleMvpApp')
  .factory('AccountService', function ($q, $window) {
    var ref = new Firebase("https://barnacle-mvp.firebaseio.com/");
    var usersRef = ref.child("twitter");
    var userData = null;
    var loggedIn = false;
    // var guest

    function clearAccountInfo(){
      loggedIn = false;
      userData = null; 
    }

    // Tests to see if /users/<userId> has any data. 
    function checkIfUserExists(userId, shouldCreate) {
      console.log('[checkIfUserExists] userId: ', userId);

      // var usersRef = new Firebase(usersRef);
      return usersRef.child(userId).once('value', function(snapshot) {
        console.log('snapshot: ', snapshot.val());
        var exists = (snapshot.val() !== null);
        if(exists){
          //get user info
          userData = snapshot.val();
          return true;
        }
        else if(shouldCreate){
          alert('trying to create user, dont do!');
          console.log('userData: ', userData);
          /*var email = 'email' in userData ? userData.email : null;
          var provider = 'provider' in userData ? userData.provider : 'twitter';
          var profileImageURL = 'profileImageURL' in userData ? userData.profileImageURL : null;
          usersRef.child(userId).set({userId:userId, displayName:userData.displayName, email:email, provider:provider, profileImageURL:profileImageURL});
          loggedIn = true;*/
          return false;
        }
        else{
          return false;
        }
        // return userExistsCallback(userId, exists);
      });
    }

    function userExistsCallback(userId, exists) {
      if (exists){
        console.log('user ' + userId + ' exists!');
        //do stuff
        loggedIn = true;
        return true;
      }
      else if (userData === null){
        return false;
      }
      else{
        console.log('user ' + userId + ' does not exist!');
        //create a user in our database
        usersRef.child(userId).set({userId:userId, displayName:userData.displayName, email:userData.email, provider:userData.provider});
        loggedIn = true;
        return true;
      }
    }


  
    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        var provider = authData.provider;
        userData = authData[provider];

        console.log('provider: ', provider);
        console.log('userData: ', userData);
        checkIfUserExists(authData.uid);

      } else {
        console.log("User is logged out");
      }
    }
    // Register the callback to be fired every time auth state changes
    var ref = new Firebase("https://barnacle-mvp.firebaseio.com/");
    // ref.onAuth(authDataCallback);

    /* 
      we need to check if the user has a profile by the uid. if so, then continue.
      else, ref.child("users").child(authData.uid).set({
        provider: authData.provider,
        name: getName(authData)
      }); <- create user in our database

      how to check if user already exists? .once()?
    */

    // function tryThis (argument) {
    //   console.log('try: ', argument);
    // }

    function onCompleteUserReviewUpdate(error){
      if (error) {
        console.log('Synchronization failed');
        successfulUserReviewUpdate = 'Synchronization failed';
      } else {
        console.log('Synchronization succeeded');
        successfulUserReviewUpdate = 'Synchronization succeeded';
      }
    };

    // Public API here
    return {
      loginFacebook: function(){
        return ref.authWithOAuthPopup("facebook", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            var provider = authData.provider;
            userData = authData[provider];

            console.log('provider: ', provider);
            console.log('userData: ', userData);
            // usersRef.child(authData.uid).set({userId:authData.uid, displayName:userData.displayName, email:userData.email});
            loggedIn = true;
            return checkIfUserExists(authData.uid, true);
          }
        },{scope: "email"});
      },
      loginTwitter: function(){
        console.log('[loginTwitter]');
        return ref.authWithOAuthPopup("twitter", function(error, authData) {
          console.log('made it back to twitter');
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            console.log(authData.twitter.id, authData.twitter.username, authData.twitter.displayName, authData.twitter.profileImageURL);
            var provider = authData.provider;
            userData = authData[provider];

            console.log('provider: ', provider);
            console.log('userData: ', userData);
            // usersRef.child(authData.uid).set({userId:authData.uid, displayName:userData.displayName, email:userData.email});
            loggedIn = true;
            return checkIfUserExists(authData.uid, true);
            // return true;
          }
        });
      },
      guestAccount: function(){

        // if()
        var ref = new Firebase("https://barnacle-mvp.firebaseio.com/guestAccounts");

        // var ref = ref.child("guestAccounts");
        //creates a random id and then save to localStorage (?)
        var d = new Date();
        return ref.push({'date':d.toISOString()});
        // var path = newMessageRef.toString();
        // console.log('opath: ', path);

      },
      logOut: function(){
        var v = ref.unauth();
        console.log('v: ', v);
        clearAccountInfo();
        return true;
      },
      unAuth: function(){
        ref.unauth();
        return;
      },
      userLoginStatus: function(){
        console.log('userLoginStatus');
        var defer = $q.defer();
        var authData = ref.getAuth();
        console.log('authData');
        
        if (authData) {
          console.log("Authenticated user with uid:", authData.uid);
          return checkIfUserExists(authData.uid, false);
        }
        else{
          loggedIn = false;
          defer.resolve(false);
        }

        return defer.promise;

        // return loggedIn;
      },
      getUserInfo: function(){
        var defer = $q.defer();
        if($window.localStorage.getItem('guestAccount')){
          console.log('s: ', $window.localStorage.getItem('guestAccount'));
          var r = new Firebase($window.localStorage.getItem('guestAccount'));
          r.once('value', function(snapshot) {
            console.log('getUserInfo: ', snapshot.val());
            defer.resolve(snapshot.val());
          })
        }
        else if(userData !== null){
          usersRef.child(userData.userId).once('value', function(snapshot) {
            var us = snapshot.val();
            defer.resolve(us);
          })
        }
        else{
          defer.resolve(null);
        }
        return defer.promise;
      },
      updateUserTags: function(tags){
        // console.log('adding tags to user profile: ', tags);
        // console.log('userData: ', userData);
        var otherTags = userData.tags;
        var currentTags = otherTags;
        for(var i = 0; i < tags.length; i++){
          currentTags[tags[i].label] = true;
        }
        // console.log('currentTags: ', currentTags);
        // otherTags.pus
        usersRef.child(userData.userId).update({tags:currentTags});
      },
      updateUserReviews: function(reviewId){
        var defer = $q.defer();
        if(reviewId !== null){

          //check for a guest account
          if($window.localStorage.getItem('guestAccount')){
            var r = new Firebase($window.localStorage.getItem('guestAccount'));

            r.once('value', function(snapshot) {
              var us = snapshot.val();
              var reviews = [];
              try{
                reviews = us.reviews;
                reviews.push(reviewId);
              }
              catch(e){
                reviews = [reviewId]
              }

              r.update({reviews:reviews}, function(error){
                if (error) {
                  console.log('[updateUserReviews] GUEST Synchronization failed');
                  // successfulUserReviewUpdate = 'Synchronization failed';
                  defer.resolve(false);
                } else {
                  console.log('[updateUserReviews] GUEST Synchronization succeeded');
                  // successfulUserReviewUpdate = 'Synchronization succeeded';
                  defer.resolve(true);
                }
              })
            })
          }
          else{
            usersRef.child(userData.userId).once('value', function(snapshot) {
              var us = snapshot.val();
              var reviews = [];
              try{
                reviews = us.reviews;
                reviews.push(reviewId);
              }
              catch(e){
                reviews = [reviewId]
              }

              usersRef.child(userData.userId).update({reviews:reviews}, function(error){
                // console.log('made it');
                if (error) {
                  console.log('[updateUserReviews] Synchronization failed');
                  // successfulUserReviewUpdate = 'Synchronization failed';
                  defer.resolve(false);
                } else {
                  console.log('[updateUserReviews] Synchronization succeeded');
                  // successfulUserReviewUpdate = 'Synchronization succeeded';
                  defer.resolve(true);
                }
              });
            })

            
          }
        }
        else{
          defer.resolve(false);
        }

        return defer.promise;

      }
    };
  });
