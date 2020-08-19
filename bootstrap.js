const { logger } = require('./utils');
const { fstat, writeFile } = require('fs');
const moment = require('moment');
logger.info('starting app');
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
    logger.info('launching node app');
    child = spawn('node', ['index.js']);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
      var str = data.toString();
      console.log(str);
      writeUpdateLog(str);
    });
    child.on('close', function (code) {
      console.log('process exit code ' + code);
    });
  }
  function updateAndStartApp() {
    logger.log('updating app');
    child = spawn('git', ['pull']);
    child.stdout.setEncoding('utf-8');
    child.stdout.on(`data`, function (data) {
      var str = data.toString();
      console.log(str);
      writeUpdateLog(str);
    });
  }
  function writeUpdateLog(str) {
    //write to update log(don't logger since i don't use that very often)
    writeFile(
      './update.log',
      `-------------------${moment().format(
        'DD:MM:YYYY',
      )}----------------------\n\n${str}\n\n\n\n\n\n`,
    );
  }
  app.get('/', restartApp);
  app.post('/', restartApp);
  updateAndStartApp();
  http.createServer(app).listen(port, function () {
    console.log('Express server listening on port ' + port);
  });
} catch (err) {
  logger.error(err);
}
