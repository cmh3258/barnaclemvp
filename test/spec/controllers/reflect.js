'use strict';

describe('Controller: ReflectCtrl', function () {

  // load the controller's module
  beforeEach(module('barnacleMvpApp'));

  var ReflectCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReflectCtrl = $controller('ReflectCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
