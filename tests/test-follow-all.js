try {
  require('tough-cookie')
} catch (e) {
  console.error('tough-cookie must be installed to run this test.')
  console.error('skipping this test. please install tough-cookie and run again if you need to test this feature.')
  process.exit(0)
}

var http = require('http')
  , request = require('../index')
  , tape = require('tape')

var server = http.createServer(function (req, res) {
  // redirect everything 3 times, no matter what.
  var c = req.headers.cookie

  if (!c) c = 0
  else c = +c.split('=')[1] || 0

  if (c > 3) {
    res.end('ok')
    return
  }

  res.setHeader('set-cookie', 'c=' + (c + 1))
  res.setHeader('location', req.url)
  res.statusCode = 302
  res.end('try again')
})

tape('setup', function(t) {
  server.listen(6767, function() {
    t.end()
  })
})

tape('followAllRedirects', function(t) {
  var redirects = 0

  request.post({
    url: 'http://localhost:6767/foo',
    followAllRedirects: true,
    jar: true,
    form: { foo: 'bar' }
  }, function (err, res, body) {
    t.equal(err, null)
    t.equal(body, 'ok')
    t.equal(redirects, 4)
    t.end()
  }).on('redirect', function() {
    redirects++
  })
})

tape('cleanup', function(t) {
  server.close()
  t.end()
})
