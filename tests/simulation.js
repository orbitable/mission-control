var fakeId = '56ca44c0b61563713582121b';
var testData = { bodies: [{ position: {x: 0, y: 0}, mass: 0}] };

exports.run = function() {
  F.assert('Simulation API GET', '/simulations', ['get'],  function(error, data, code, headers) {
    assert.ok(code === 200, 'did not get 200');
  });

  F.assert("Simulation API GET bad id", '/simulations/bad_id', ['get'], function(error, data, code, headers) {
    assert.ok(code === 400, 'did not get a 400 when using bad id: ' + code);
  });

  F.assert("Simulation API GET", '/simulations/' + fakeId, ['get'], function(error, data, code, headers) {
    assert.ok(code === 404, 'did not get 404 for non existent simulation');
  });

  F.assert("Simulation API PUT missing position", "/simulations", ['post', 'json'], function(error, data, code, headers) {
    assert.ok(code == 400, 'did not get a bad request(400): ' + code);
  }, {bodies: [{mass: 12, radius: 1}]});

  F.assert("Simulation API PUT missing mass", "/simulations", ['post', 'json'], function(error, data, code, headers) {
    assert.ok(code == 400, 'did not get a bad request(400): ' + code);
  }, {bodies: [{position: {x: 0, y:0 }, radius: 1}]});

  F.assert("Simulation API PUT", '/simulations', ['post', 'json'], function(error, data, code, headers) {
    assert.ok(code == 200, 'did not get a success (200): (' + code + ') ' + error);
  }, testData );

  F.assert('Simulation API DELETE', '/simulations/' + fakeId, ['delete', 'json'], function(error, data, code, headers) {
    assert.ok(code == 404, 'expected delete to return 404: ' + code);
  });

  // TODO: Implement delete with a given id
};
