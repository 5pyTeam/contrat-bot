const { logger } = require('./utils');
try {
  var express = require('express'),
    http = require('http'),
    cp = require('child_process'),
    spawn = cp.spawn,
    exec = cp.exec,
    app = express();
  var child,
    port = 3011;
  function restartApp(req, res) {
    spawn('git', ['pull']);
    child.kill();
    startApp();
    res.send('ok.');
  }

  function startApp() {
    child = spawn('node', ['index.js']);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
      var str = data.toString();
      console.log(str);
    });
    child.on('close', function (code) {
      console.log('process exit code ' + code);
    });
  }
  app.get('/', restartApp);
  app.post('/', restartApp);
  startApp();
  http.createServer(app).listen(port, function () {
    console.log('Express server listening on port ' + port);
  });
} catch (err) {
  logger.error(err);
}
