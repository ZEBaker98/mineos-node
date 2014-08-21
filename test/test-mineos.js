var fs = require('fs.extra');
var path = require('path');
var touch = require("touch");
var mineos = require('../mineos/mineos');
var test = exports;
var BASE_DIR = '/var/games/minecraft';

test.tearDown = function(callback) {
  var server_list = mineos.server_list(BASE_DIR);
  for (var i in server_list) {
    fs.rmrfSync(path.join(BASE_DIR, 'servers', server_list[i]));
  }
  callback();
}

test.server_list = function (test) {
  var servers = mineos.server_list(BASE_DIR);
  test.ok(servers instanceof Array, "server returns an array");

  mineos.create_server('test');
  servers = mineos.server_list(BASE_DIR);

  for (var i=0; i < servers.length; i++) {
    test.ok(mineos.is_server(servers[i]));
  }
  test.done();
};

test.is_server = function(test) {
  var server_name = 'testing';

  test.ok(!mineos.is_server(server_name), 'non-existent path should fail');
  
  mineos.create_server(server_name);
  test.ok(mineos.is_server(server_name), 'newly created path + sp should succeed');

  test.done();
}

test.create_server = function(test) {
  var server_name = 'ccc';
  var server_path = path.join(BASE_DIR, 'servers', server_name);

  test.equal(mineos.server_list(BASE_DIR).length, 0);

  test.ok(!mineos.is_server(server_path));

  mineos.create_server(server_name);
  test.ok(fs.existsSync(server_path));
  test.ok(fs.existsSync(path.join(server_path, 'server.properties')));
  test.ok(fs.existsSync(path.join(server_path, 'server.config')));

  test.equal(mineos.server_list(BASE_DIR)[0], server_name);
  test.equal(mineos.server_list(BASE_DIR).length, 1);
  
  test.done();
}