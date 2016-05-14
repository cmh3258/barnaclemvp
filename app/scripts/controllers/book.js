'use strict';

/**
 * @ngdoc function
 * @name barnacleMvpApp.controller:BookCtrl
 * @description
 * # BookCtrl
 * Controller of the barnacleMvpApp
 */
angular.module('barnacleMvpApp')
  .controller('BookCtrl', function ($scope, $location, $routeParams, $http, ReviewService, AccountService, OrderService, $base64) {
  
    $scope.data = null;
    $scope.popUp = false;
    var reviewId = null;
    $scope.showForm = false;

    initial();

    function initial(){
      if('reviewId' in $routeParams){
        // console.log('routeParams: ', $routeParams.reviewId);
        reviewId = $routeParams.reviewId;
        ReviewService.viewCurrentReviewWToken($routeParams.reviewId).then(function(response){
          console.log('current review: ', response);

          console.log('is owner of post: ', AccountService.userOwnsReview($routeParams.reviewId));

          if(!response){
            $location.path('/reflect');
          }
          else{
            $scope.data = response;
          }
        })
      }
      else{
        loadReview();
      }
    }

    function loadReview(){
      ReviewService.viewCurrentReview().then(function(response){
        console.log('current review: ', response);
        if(!response){
          $location.path('/reflect');
        }
        else{
          $scope.data = response;

        }
      })
    }

    $scope.closeModal = function(){
      $scope.popUp = false;
    }

    $scope.doCheckout = function(token) {
      alert("Got Stripe token: " + token.id);
    };

    $scope.purchaseForm = function(show){
      // $scope.showForm = show;
      var data = $scope.data;

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
          }
        }
       };

      for(var i = 0; i < data.posts.length; i++){
        var post = data.posts[i];
        docDefinition.content.push({
          text:post.source, style: 'source'
        })
        docDefinition.content.push({
          text:post.created_at, style: 'created_at'
        })
        if(post.title !== undefined){
          docDefinition.content.push({
            text:post.title, style: 'header'
          })
        }
        if(post.text !== undefined){
          docDefinition.content.push({
            text:post.text, style: 'text'
          })
        }
        if(post.image !== undefined){
          console.log('ur: ', post.image);
          // convertImgToDataURLviaCanvas(post.image);
          getDataUri(post.image);

          // var imageData=$base64.encode(post.image);
          // console.log('imageData: ', imageData);
          // imageData = "data:image/png;base64," + imageData

          // var p = getBase64Image(post.image);

          // docDefinition.content.push({
          //   image:imageData
          // })
        }
        if(post.hashtags !== undefined){
          docDefinition.content.push({
            text:post.hashtags, style: 'tags'
          })
        }
      }

      console.log('docDefinition: ', docDefinition);



      // open the PDF in a new window
      // pdfMake.createPdf(docDefinition).open();

      // print the PDF (not working in this version, will be added back in a couple of days)
      // pdfMake.createPdf(docDefinition).print();

      // download the PDF
      // pdfMake.createPdf(docDefinition).download();


    }

    function getDataUri(url){
      var data = {
        'img_url':url
      }
      $http({
        method: 'POST',
        url: 'http://127.0.0.1:5000/transform',
        data: data
      }).then(function successCallback(response) {
          console.log('g: ', response);
        }, function errorCallback(response) {
          console.log('b: ', response);
        });

    }

    function convertImgToDataURLviaCanvas(url, callback){
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
          var canvas = document.createElement('CANVAS');
          var ctx = canvas.getContext('2d');
          var dataURL;
          canvas.height = this.height;
          canvas.width = this.width;
          ctx.drawImage(this, 0, 0);
          dataURL = canvas.toDataURL();
          // callback(dataURL);
          console.log('dU: ', dataURL);
          canvas = null; 
      };
      img.src = url;
  }




    /*function getDataUri(url, callback) {
      var image = new Image();


      image.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
          canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

          canvas.getContext('2d').drawImage(this, 0, 0);

          // Get raw image data
          callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

          // ... or get as Data URI
          callback(canvas.toDataURL('image/png'));
      };

      image.src = url;
  }*/




    $scope.submitOrder = function(order){
      console.log('submitting order: ', order, reviewId);
      order.price = 0;
      order.is_complete = false;

      if(order === undefined){
        return false;
      }
      else if(order.name === undefined || order.name.length === 0){
        return false;
      }
      else if(order.address === undefined || order.address.length === 0){
        return false;
      }
      else{
        order.reviewId = reviewId;
        var orderId = OrderService.pushOrder(order);
        if(orderId){
          AccountService.addOrderIdToUser(orderId).then(function(response){
            alert('done adding order to user.');
            alert('response: ' + response);
            return 'done';
          })
        }
      }

    }

    

    

  });
