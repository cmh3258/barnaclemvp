'use strict';

describe('Service: reviewservice', function () {

  // load the service's module
  beforeEach(module('barnacleMvpApp'));

  // instantiate service
  var reviewservice;
  beforeEach(inject(function (_reviewservice_) {
    reviewservice = _reviewservice_;
  }));

  it('should do something', function () {
    expect(!!reviewservice).toBe(true);
  });

});
