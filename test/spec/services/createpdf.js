'use strict';

describe('Service: createpdf', function () {

  // load the service's module
  beforeEach(module('barnacleMvpApp'));

  // instantiate service
  var createpdf;
  beforeEach(inject(function (_createpdf_) {
    createpdf = _createpdf_;
  }));

  it('should do something', function () {
    expect(!!createpdf).toBe(true);
  });

});
