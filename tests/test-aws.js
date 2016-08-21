'use strict'

var request = require('../index') 
  , server  = require('./server')
  , tape    = require('tape')

var s = server.createServer()

var path = '/aws.json'

s.on(path, function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(req.headers))
})

tape('setup', function(t) {
  s.listen(s.port, function() {
    t.end()
  })
})

tape('default behaviour: aws-sign2 without sign_version key', function(t) {
  var options = {
    url: s.url + path,
    aws: {
      key: 'my_key',
      secret: 'my_secret'
    },
    json: true
  }
  request(options, function(err, res, body) {    
    t.ok(body.authorization)
    t.notOk(body['x-amz-date'])
    t.end()
  })
})

tape('aws-sign4 options', function(t) {
  var options = {
    url: s.url + path,
    aws: {
      key: 'my_key',
      secret: 'my_secret',
      sign_version: 4
    },
    json: true
  }
  request(options, function(err, res, body) {    
    t.ok(body.authorization)
    t.ok(body['x-amz-date'])
    t.end()
  })
})

tape('aws-sign4 options with service,region', function(t) {
  var options = {
    url: s.url + path,
    aws: {
      key: 'my_key',
      secret: 'my_secret',
      service: 'execute-api',
      region: 'ap-northeast-1',
      sign_version: 4
    },
    json: true
  }
  request(options, function(err, res, body) {    
    t.ok(body.authorization)
    var credential = body.authorization.match(/Credential=([^,]+)/)[1]
    var testRegex = /my_key\/[0-9]{8}\/ap-northeast-1\/execute-api\/aws4_request/
    t.ok(testRegex.test(credential))
    t.ok(body['x-amz-date'])
    t.end()
  })
})


tape('aws-sign4 with sessionToken', function(t) {
  var options = {
    url: s.url + path,
    aws: {
      key: 'my_key',
      secret: 'my_secret',
      sessionToken: 'my_token',
      sign_version: 4
    },
    json: true
  }
  request(options, function(err, res, body) {    
    t.ok(body.authorization)
    t.ok(body['x-amz-date'])
    t.ok(body['x-amz-security-token'])
    t.end()
  })
})

tape('cleanup', function(t) {
  s.close(function() {
    t.end()
  })
})
