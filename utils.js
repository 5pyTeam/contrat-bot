const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('settings.json'));
const data = JSON.parse(fs.readFileSync(settings.dataPath));
const { exec } = require('child_process');
const { createLogger, format, transports } = require('winston');
const moment = require('moment');
const { combine, timestamp, label, prettyPrint, simple } = format;
class utils {
  /*---------------- data ---------------*/
  //
  static setData(guild, rank, content) {
    if (!data[guild]) {
      data[guild] = {};
    }
    console.log(data);
    data[guild][rank] = content;
    this.writeDataToFile();
  }
  static getData(rank) {
    return data[rank];
  }
  static dateSize() {
    return Object.keys(myObject).length;
  }
  static delData(rank) {
    delete data[rank];
    this.writeDataToFile();
  }
  static writeDataToFile() {
    fs.writeFileSync(settings.dataPath, JSON.stringify(data));
    this.prettierFile(settings.dataPath);
  }
  //
  //
  /*--------------settings ---------------------*/
  static getSettings(rank) {
    return settings[rank];
  }
  static setSettings(rank, content) {
    settings[rank] = content;
    this.writeSettingsToFile();
  }
  static writeSettingsToFile() {
    fs.writeFileSync('settings.json', JSON.stringify(settings));
    this.prettierFile('settings.json');
  }
  //
  //
  /*----------other-----------------*/
  static prettierFile(path) {
    exec(` prettier --write ${path}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }
  static verifyContractOfGuild(guild) {
    logger.info('run');
    for (var id in data[guild.id]) {
      const member = guild.member(id);
      const date = moment(data[guild.id][id].date);
      const type = data[guild.id][id].length.split('')[1];
      const length = parseInt(data[guild.id][id].length.split('')[0]);
      const expireDate = moment(date);
      logger.info(`------${member.user.username}--------`);
      logger.info(`contract date: ${date.format('DD.MM.YYYY')}`);
      logger.info(`contract length: ${length}${type}`);
      expireDate.add(length, type);
      const left = expireDate.diff(moment(), 'days') + 1;
      logger.info(`left: ${left}`);
      for (var value in settings['reminderMessages']) {
        if (
          parseInt(settings['reminderMessages'][value]['dayLeft']) ==
          left
        ) {
          member.send(settings['reminderMessages'][value]['message']);
          logger.info(
            `sending dm to ${member.user.username} because he has ${left} days left`,
          );
        }
      }
    }
  }
}
//winston configuration
const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({ format: simple() }),
  ],
});

module.exports = { utils, logger };
