const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('settings.json'));
const data = JSON.parse(fs.readFileSync(settings.dataPath));
const { exec } = require('child_process');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint,simple } = format;
class utils {
  /*---------------- data ---------------*/
  //
  static setData(guild, rank, content) {
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
    for (var id in jsonData[guild.id]) {
      const member = guild.member(id);
      const date = moment(jsonData[id].date);
      const type = jsonData[id].length.split('')[1];
      const length = parseInt(jsonData[id].length.split('')[0]);
      const expireDate = moment(date);
      logger.debug(`------${member.user.username}--------`);
      logger.debug(`contract date: ${date.format('DD.MM.YYYY')}`);
      logger.debug(`contract length: ${length}${type}`);
      expireDate.add(length, type);
      const left = expireDate.diff(moment(), 'days') + 1;
      logger.debug(`left: ${left}`);
      for (var value in remindersWithMessage) {
        if (parseInt(value) == left) {
          member.send(remindersWithMessage[value]);
          logger.debug(
            `sending dm to ${member.user.username} because he has ${left} days left`,
          );
        }
      }
    }
  }
}
//winston configuration
const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [

      new transports.File({filename: 'error.log', level: 'error'}),
      new transports.File({filename: 'combined.log'}),
      new transports.Console({format: simple()})
  ]
});


module.exports = { utils , logger};
