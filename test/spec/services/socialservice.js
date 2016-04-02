'use strict';

describe('Service: socialservice', function () {

  // load the service's module
  beforeEach(module('barnacleMvpApp'));

  // instantiate service
  var socialservice;
  beforeEach(inject(function (_socialservice_) {
    socialservice = _socialservice_;
  }));

  it('should do something', function () {
    expect(!!socialservice).toBe(true);
  });

});
