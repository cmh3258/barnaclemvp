'use strict';

/**
 * @ngdoc service
 * @name barnacleMvpApp.OrderService
 * @description
 * # OrderService
 * Factory in the barnacleMvpApp.
 */
angular.module('barnacleMvpApp')
  .factory('OrderService', function () {

    var orderRef = new Firebase("https://barnacle-mvp.firebaseio.com/orders");

    // Public API here
    return {
      pushOrder: function(order){
        var orderId = orderRef.push(order);
        return orderId.name();
      }
    };
  });
