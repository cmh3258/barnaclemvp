'use strict';

describe('Directive: profilepreview', function () {

  // load the directive's module
  beforeEach(module('barnacleMvpApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<profilepreview></profilepreview>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the profilepreview directive');
  }));
});
