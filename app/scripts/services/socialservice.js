'use strict';

/**
 * @ngdoc service
 * @name barnacleMvpApp.socialservice
 * @description
 * # socialservice
 * Factory in the barnacleMvpApp.
 */
angular.module('barnacleMvpApp')
  .factory('SocialService', function ($q) {

    var socialObjects = {
      twitter: null,
      instagram: null,
      wordpress: null
    }
    
    function auth(socialsite){
      //Example with Twitter with the cache option enabled (pulls from auth from cache so can use api)
      console.log('[auth] socialsite: ', socialsite);
      OAuth.popup(socialsite, {cache: true}).done(function(response) {
        console.log('socialsite auth response: ', response);
        //make API calls with `twitter`
        socialObjects.socialsite = response;
      }).fail(function(err) {
        //todo when the OAuth flow failed
        alert('auth failed,');
        console.log('err: ', err);
      })
    }

    function twitterTimeline(){
      //create a deferred object using Angular's $q service
      var deferred = $q.defer();
      var newResults = [];

      var promise = socialObjects.twitter.get('/1.1/statuses/user_timeline.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
          //when the data is retrieved resolved the deferred object
          console.log('data: ', data);

          //process data
          for(var i = 0; i < data.length; i++){
            var info = data[i];
            var image = '';
            var hashtags = '';
            if('entities' in info){
              if('media' in info.entities){
                if(info.entities.media.length > 0){
                  image = info.entities.media[0].media_url_https;
                }
              }
              if(info.entities.hashtags > 0){
                hashtags = info.entities.hashtags;
              }
            }
            newResults.push({
              'source':'twitter',
              'text':info.text,
              'created_at':info.created_at,
              'image':image,
              'hashtags':hashtags
            })
          }

          deferred.resolve(newResults);
      });

      //return the promise of the deferred object
      return deferred.promise;

    }


    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      },
      checkSocialStatus: function(){
        var twitter = OAuth.create('twitter');
        var instagram = OAuth.create('instagram');
        var wordpress = OAuth.create('wordpress');

        if(twitter !== null){
          socialObjects.twitter = twitter;
        }
        if(instagram !== null){
          socialObjects.instagram = instagram;
        }
        if(wordpress !== null){
          socialObjects.wordpress = wordpress;
        }

        console.log('socialObjects: ', socialObjects);

        return socialObjects;
      },
      connectSocial: function(site){
        auth(site);
      },
      loadTimeline: function(){
        var deferred = $q.defer();
        var data = [];

        for (var key in socialObjects) {
          if(socialObjects[key]){
            if(key === 'twitter'){
              data = twitterTimeline();
            }
          }
        }
        deferred.resolve(data);

        return deferred.promise;
      }
    };
  });
