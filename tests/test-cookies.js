try {
  require('tough-cookie')
} catch (e) {
  console.error('tough-cookie must be installed to run this test.')
  console.error('skipping this test. please install tough-cookie and run again if you need to test this feature.')
  process.exit(0)
}

var assert = require('assert')
  , http = require('http')
  , request = require('../index')
  , tape = require('tape')


var validUrl = 'http://localhost:6767/valid'
  , invalidUrl = 'http://localhost:6767/invalid'

var server = http.createServer(function (req, res) {
  if (req.url === '/valid')
    res.setHeader('set-cookie', 'foo=bar')
  else if (req.url === '/invalid')
    res.setHeader('set-cookie', 'foo=bar; Domain=foo.com')
  res.end('okay')
})

tape('setup', function(t) {
  server.listen(6767, function() {
    t.end()
  })
})

tape('simple cookie creation', function(t) {
  var cookie = request.cookie('foo=bar')
  t.equals(cookie.key, 'foo')
  t.equals(cookie.value, 'bar')
  t.end()
})

tape('after server sends a cookie', function(t) {
  var jar1 = request.jar()
  request({
    method: 'GET',
    url: validUrl,
    jar: jar1
  },
  function (error, response, body) {
    t.equal(error, null)
    t.equal(jar1.getCookieString(validUrl), 'foo=bar')
    t.equal(body, 'okay')

    var cookies = jar1.getCookies(validUrl)
    t.equal(cookies.length, 1)
    t.equal(cookies[0].key, 'foo')
    t.equal(cookies[0].value, 'bar')
    t.end()
  })
})

tape('after server sends a cookie for a different domain', function(t) {
  var jar2 = request.jar()
  request({
    method: 'GET',
    url: invalidUrl,
    jar: jar2
  },
  function (error, response, body) {
    t.equal(error, null)
    t.equal(jar2.getCookieString(validUrl), '')
    t.deepEqual(jar2.getCookies(validUrl), [])
    t.equal(body, 'okay')
    t.end()
  })
})

tape('cleanup', function(t) {
  server.close()
  t.end()
})
