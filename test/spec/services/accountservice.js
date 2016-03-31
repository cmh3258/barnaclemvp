'use strict';

describe('Service: accountservice', function () {

  // load the service's module
  beforeEach(module('barnacleMvpApp'));

  // instantiate service
  var accountservice;
  beforeEach(inject(function (_accountservice_) {
    accountservice = _accountservice_;
  }));

  it('should do something', function () {
    expect(!!accountservice).toBe(true);
  });

});
