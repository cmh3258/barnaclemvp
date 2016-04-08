'use strict';

describe('Controller: WriteupdateCtrl', function () {

  // load the controller's module
  beforeEach(module('barnacleMvpApp'));

  var WriteupdateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WriteupdateCtrl = $controller('WriteupdateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
