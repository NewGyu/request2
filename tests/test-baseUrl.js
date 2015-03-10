'use strict'

var http = require('http')
  , request = require('../index')
  , tape = require('tape')

var s = http.createServer(function(req, res) {
  res.statusCode = 200
  res.setHeader('X-PATH', req.url)
  res.end('ok')
})

tape('setup', function(t) {
  s.listen(6767, function() {
    t.end()
  })
})

tape('baseUrl', function(t) {
  request('resource', {
    baseUrl: 'http://localhost:6767'
  }, function(err, resp, body) {
    t.equal(err, null)
    t.equal(body, 'ok')
    t.end()
  })
})

tape('baseUrl defaults', function(t) {
  var withDefaults = request.defaults({
    baseUrl: 'http://localhost:6767'
  })
  withDefaults('resource', function(err, resp, body) {
    t.equal(err, null)
    t.equal(body, 'ok')
    t.end()
  })
})

tape('baseUrl without path', function(t) {
  request('resource', {
    baseUrl: 'http://localhost:6767'
  }, function(err, resp, body) {
    t.equal(err, null)
    t.equal(body, 'ok')
    t.equal(resp.headers['x-path'], '/resource')
    t.end()
  })
})

tape('baseUrl without path, with trailing slash', function(t) {
  request('resource', {
    baseUrl: 'http://localhost:6767/'
  }, function(err, resp, body) {
    t.equal(err, null)
    t.equal(body, 'ok')
    t.equal(resp.headers['x-path'], '/resource')
    t.end()
  })
})

tape('baseUrl with path', function(t) {
  request('resource', {
    baseUrl: 'http://localhost:6767/path/to'
  }, function(err, resp, body) {
    t.equal(err, null)
    t.equal(body, 'ok')
    t.equal(resp.headers['x-path'], '/path/to/resource')
    t.end()
  })
})

tape('baseUrl with path and trailing slash', function(t) {
  request('resource', {
    baseUrl: 'http://localhost:6767/path/to/'
  }, function(err, resp, body) {
    t.equal(err, null)
    t.equal(body, 'ok')
    t.equal(resp.headers['x-path'], '/path/to/resource')
    t.end()
  })
})

tape('baseUrl with empty uri', function(t) {
  request('', {
    baseUrl: 'http://localhost:6767/path/to'
  }, function(err, resp, body) {
    t.equal(err, null)
    t.equal(body, 'ok')
    t.equal(resp.headers['x-path'], '/path/to/')
    t.end()
  })
})

tape('baseUrl with trailing slash and empty uri', function(t) {
  request('', {
    baseUrl: 'http://localhost:6767/path/to/'
  }, function(err, resp, body) {
    t.equal(err, null)
    t.equal(body, 'ok')
    t.equal(resp.headers['x-path'], '/path/to/')
    t.end()
  })
})

tape('cleanup', function(t) {
  s.close(function() {
    t.end()
  })
})
