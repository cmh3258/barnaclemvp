'use strict';

/**
 * @ngdoc service
 * @name barnacleMvpApp.createpdf
 * @description
 * # createpdf
 * Factory in the barnacleMvpApp.
 */
angular.module('barnacleMvpApp')
  .factory('createpdf', function ($http, $q) {

    function makeIt(data){
      var docDefinition = { 
        content: [
          { text: data.title, style: 'header' },
          { text: data.date},
          { text: data.author},
          { text: data.text},

          'No styling here, this is a standard paragraph',
          { text: 'Another text', style: 'anotherStyle' },
          { text: 'Multiple styles applied', style: [ 'header', 'anotherStyle' ] }
        ],

        styles: {
          header: {
            fontSize: 22,
            bold: true,
            alignment: 'center'
          },
          anotherStyle: {
            italics: true,
            alignment: 'right'
          },
          mystyle: {
            width: '100%'
          }
        }
       };

      // pdfMake.createPdf(docDefinition).open();


      var promises = []
      for(var i = 0; i < data.posts.length; i++){

        var post = data.posts[i];
        promises.push(makeObject(post));
      }

      console.log('docDefinition: ', docDefinition);


      $q.all(promises).then(function(response){
        console.log('all promises: ', response);
        for(var i = 0; i < response.length; i++){
          console.log('concat: ', response[i]);
          docDefinition.content = docDefinition.content.concat(response[i]);
        }
        console.log('docDefinition2: ', docDefinition);
      
        // pdfMake.createPdf(docDefinition).open();
        // pdfMake.createPdf(docDefinition).download();

      })


      // open the PDF in a new window
      // pdfMake.createPdf(docDefinition).open();

      // print the PDF (not working in this version, will be added back in a couple of days)
      // pdfMake.createPdf(docDefinition).print();

      // download the PDF
      // pdfMake.createPdf(docDefinition).download();
    }


    function makeObject(post){
      var defer = $q.defer();
      var content = [];

      content.push({
          text:post.source, style: 'source'
        })
        content.push({
          text:post.created_at, style: 'created_at'
        })
        if(post.title !== undefined){
          content.push({
            text:post.title, style: 'header'
          })
        }
        if(post.text !== undefined){

          var text = post.text ? String(post.text).replace(/<[^>]+>/gm, '') : '';
          console.log('text: ', text);

          content.push({
            text:text, style: 'text'
          })
        }
        if(post.hashtags !== undefined){
          content.push({
            text:post.hashtags, style: 'tags'
          })
        }
        if(post.image !== undefined){
          console.log('ur: ', post.image);
          // convertImgToDataURLviaCanvas(post.image);
          getDataUri(post.image).then(function(image_url){
            if(image_url){
              if('data' in image_url){
                content.push({
                  image:image_url.data, style:'myimage'
                })
                defer.resolve(content);
              }
              defer.resolve(content);
            }
            defer.resolve(content);
          })
        }
        else{
          defer.resolse(content)
        }
        
      return defer.promise;
    }


    function getDataUri(url){
      var data = {
        'img_url':url
      }
      return $http({
        method: 'POST',
        url: 'http://127.0.0.1:5000/transform',
        data: data
      }).then(function successCallback(response) {
          return response;
        }, function errorCallback(response) {
          console.log('b: ', response);
          return null;
        });

    }

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      },
      create: function(data){
        // makeIt(data);
            window.print();
        
      }
    };
  });
