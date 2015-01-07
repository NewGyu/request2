var spawn = require('child_process').spawn;
var https = require('https');
var fs = require('fs');

https.createServer({
    key: fs.readFileSync(__dirname + '/ssl/server.key'),
    cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
    ca: fs.readFileSync(__dirname + '/ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
  }, function (req, res) {
    // Set CORS header, since that is something we are testing.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200);
    res.end("Can you hear the sound of an enormous door slamming in the depths of hell?\n");
}).listen(8000, function() {
  console.log('Started https server for karma tests on port 8000');
  // Spawn process for karma.
  var c = spawn('karma', [
    'start',
    __dirname + '/karma.conf.js'
  ]);
  c.stdout.pipe(process.stdout);
  c.on('exit', function(c) {
    // Exit process with karma exit code.
    process.exit(c);
  });
});
