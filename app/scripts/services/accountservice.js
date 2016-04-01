'use strict';

/**
 * @ngdoc service
 * @name barnacleMvpApp.accountservice
 * @description
 * # accountservice
 * Factory in the barnacleMvpApp.
 */
angular.module('barnacleMvpApp')
  .factory('AccountService', function ($q) {
    var ref = new Firebase("https://barnacle-mvp.firebaseio.com/");
    var usersRef = ref.child("users");
    var userData = null;
    var loggedIn = false;

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
          console.log('userData: ', userData);
          var email = 'email' in userData ? userData.email : null;
          var provider = 'provider' in userData ? userData.provider : 'twitter';
          usersRef.child(userId).set({userId:userId, displayName:userData.displayName, email:email, provider:provider});
          loggedIn = true;
          return true;
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
      logOut: function(){
        var v = ref.unauth();
        console.log('v: ', v);
        clearAccountInfo();
        return true;
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
        return userData;
      },
      updateUserTags: function(tags){
        console.log('adding tags to user profile: ', tags);
        console.log('userData: ', userData);
        var otherTags = userData.tags;
        var currentTags = otherTags;
        for(var i = 0; i < tags.length; i++){
          currentTags[tags[i].label] = true;
        }
        // console.log('currentTags: ', currentTags);
        // otherTags.pus
        usersRef.child(userData.userId).update({tags:currentTags});
      }
    };
  });
