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
      wordpress: null,
      facebook: null
    }
    
    function auth(socialsite){
      var deferred = $q.defer();

      //Example with Twitter with the cache option enabled (pulls from auth from cache so can use api)
      console.log('[auth] socialsite: ', socialsite);
      OAuth.popup(socialsite, {cache: true}).done(function(response) {
        console.log('socialsite auth response: ', response);
        
        // response.me().done(function(data) {
        //     // do something with `data`, e.g. print data.name
        //     console.log('123data: ', data);
        // })

        // console.log(response.blog_id, response.blog_url);
        //make API calls with `twitter`
        socialObjects[socialsite] = response;
        deferred.resolve(socialObjects);

      }).fail(function(err) {
        //todo when the OAuth flow failed
        alert('auth failed.');
        console.log('err: ', err);
        deferred.resolve(socialObjects);

      })
      
      return deferred.promise;

    }

    function instagramPosts(){
      //create a deferred object using Angular's $q service
      var deferred = $q.defer();
      var newResults = [];
      var past_month = new Date().getMonth();


      var promise = socialObjects.instagram.get('/v1/users/self/media/recent/').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
          //when the data is retrieved resolved the deferred object
        console.log('[instagram] data: ', data);
        deferred.resolve(data.data);

      })

      return deferred.promise;

    }

    function twitterTimeline(){
      //create a deferred object using Angular's $q service
      var deferred = $q.defer();
      var newResults = [];
      var past_month = new Date().getMonth();

      var promise = socialObjects.twitter.get('/1.1/statuses/user_timeline.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
          //when the data is retrieved resolved the deferred object
          console.log('data: ', data);

          //process data
          for(var i = 0; i < data.length; i++){
            var info = data[i];
            var image = '';
            var hashtags = [];
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
            var date = new Date(info.created_at);
            newResults.push({
              'source':'twitter',
              'text':info.text,
              'title':null,
              'created_at':date.toISOString(),
              'image':image,
              'hashtags':hashtags,
              'isIncluded':true,
              'postType':'twitterContainer'
            })
          }

          deferred.resolve(newResults);
      });

      //return the promise of the deferred object
      return deferred.promise;

    }

    function fbPosts(){
      var deferred = $q.defer();
      var past_month = new Date().getMonth();
      
      console.log('need to get user-id for fb.');
      ///v2.6/{user-id}/photos HTTP/1.1
      var promise = socialObjects.facebook.get('/v2.5/me/photos').done(function(data) { 
        console.log('me: ', data);
        var newResults = [];
        var posts = data.data;
        for(var i = 0; i < posts.length; i++){
          var post = posts[i];
          newResults.push({
            'source':'facebook',
            'text':'',
            'title':post.name,
            'created_at':post.created_time,
            // 'image':image,
            // 'hashtags':hashtags,
            'isIncluded':true,
            'postType':'facebookContainer'
          })

        }

        socialObjects.facebook.get(data.paging.next).done(function(dataa) {
          console.log('paging data: ', dataa);

        })

        deferred.resolve(newResults);



        // created_time:"2016-04-08T23:24:23+0000"
        // id:"1040534056019094"
        // name:"Two handsome young men!!"

        // if('id' in data){
          // console.log(data.id, data.userID);
          // promise = socialObjects.facebook.get('/v2.6/'+data.id.toString()+'/photos').done(function(data) { 
          //   console.log('[facebook] data: ', data);


          // })
        // }
      })


      return deferred.promise;
    }

    function wordpressPosts(){
      var deferred = $q.defer();

      var past_month = new Date().getMonth();
      past_month = past_month -1 ;

      // var promise = socialObjects.wordpress.get('/v1.1/sites/pondersimple/posts/').done(function(data) { 
        // console.log(socialObjects.wordpress, socialObjects.wordpress.blog_id);
        var promise = socialObjects.wordpress.get('/rest/v1/me/').done(function(data) { 
          promise = socialObjects.wordpress.get('/rest/v1/sites/'+data.token_site_id+'/posts/').done(function(data) { 

            var newResults = [];
            console.log('[wordpressPosts] data: ', data);
            if('posts' in data){
              var posts = data.posts;
              for(var i = 0; i < posts.length; i++){

                var post = posts[i];
                var post_date = new Date(post.date);
                if(post_date.getMonth() === past_month){
                  var image = '';
                  var hashtags = [];
                  if('featured_image' in post){
                    image = post.featured_image;
                  }
                  if('tags' in post){
                    for(var key in post.tags){
                      hashtags.push(key);
                    }
                  }
                  // if('attachments' in post){
                  //   console.log('attachments: ', post.attachments);
                  //   //grab first image in attachments
                  //   for(var key in post.attachments){
                  //     image = post.attachments.key.URL;
                  //     break;
                  //   }
                  // }
                  console.log('added.');
                  newResults.push({
                    'source':'wordpress',
                    'text':post.content,
                    'title':post.title,
                    'created_at':post.date,
                    'image':image,
                    'hashtags':hashtags,
                    'isIncluded':true,
                    'postType':'wordpressContainer'
                  })
                }
              }
              deferred.resolve(newResults);
            }
            deferred.resolve(null);
          })
        })

      return deferred.promise;

      // console.log('tojson: ', socialObjects.wordpress.toJson());

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
        var facebook = OAuth.create('facebook');

        if(twitter !== null){
          socialObjects.twitter = twitter;
        }
        if(instagram !== null){
          socialObjects.instagram = instagram;
        }
        if(wordpress !== null){
          socialObjects.wordpress = wordpress;
        }
        if(facebook !== null){
          socialObjects.facebook = facebook;
        }

        console.log('socialObjects: ', socialObjects);

        return socialObjects;
      },
      connectSocial: function(site){
        var deferred = $q.defer();
        auth(site).then(function(response){
          // console.log('connectSocial response: ', response);
          deferred.resolve(response);
        })

        return deferred.promise;
      },
      loadTimeline: function(){
        var deferred = $q.defer();
        var data = [];

        for (var key in socialObjects) {
          if(socialObjects[key]){
            if(key === 'twitter'){
              data.push(twitterTimeline());
            }
            if(key === 'wordpress'){
              data.push(wordpressPosts());
            }
            if(key === 'instagram'){
              data.push(instagramPosts());
            }
            if(key === 'facebook'){
              data.push(fbPosts());
            }

          }
        }

        $q.all(data)
         .then(function (responses) {
            data = [];
            console.log(responses);
            for(var i = 0; i < responses.length; i++){
              data = data.concat(responses[i]);
              // responses.then(function(r){
              //   console.log('hi: ', r);
              // })
            }
            console.log('resolving: ', data);
            deferred.resolve(data);
         }).catch(function (data) {
             // $scope.applications = null;
             // $scope.environments = null;
         })['finally'](function(){
             // $scope.isBusy=false;
         });

        // console.log('resolve data: ', data);
        // deferred.resolve(data);

        return deferred.promise;
      },
      disconnect: function(){
        OAuth.clearCache();
      }
    };
  });
