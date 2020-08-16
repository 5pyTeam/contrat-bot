const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('settings.json'));
const data = JSON.parse(fs.readFileSync(settings.dataPath));
const { exec } = require('child_process');
const { createLogger, format, transports } = require('winston');
const moment = require('moment');
const { RichEmbed } = require('discord.js');
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
    try {
      for (var id in data[guild.id]) {
        const memberName = data[guild.id][id]['info']['name'];
        const date = moment(data[guild.id][id].date);
        const type = data[guild.id][id].length.split('')[1];
        const length = parseInt(
          data[guild.id][id].length.split('')[0],
        );
        const expireDate = moment(date);
        logger.info(`contract length: ${length}${type}`);
        expireDate.add(length, type);
        const left = expireDate.diff(moment(), 'days') + 1;
        logger.info(`left: ${left}`);
        logger.info(
          `{"name":"${memberName}", "made": "${date.format(
            'DD.MM.YYYY',
          )}", "length": ${length}${type}, "left": "${left}" }`,
        );
        for (var value in settings['reminderMessages'][guild.id]) {
          if (
            parseInt(
              settings['reminderMessages'][guild.id][value][
                'dayLeft'
              ],
            ) == left
          ) {
            guild.members.cache
              .get(id)
              .send(
                settings['reminderMessages'][guild.id][value][
                  'message'
                ],
              );
            logger.info(
              `sending dm to ${memberName} because he has ${left} days left`,
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
      logger.error(error.message + ' in verifyContractOfGuild');
    }
  }
}
//winston configuration
const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({ format: format.simple() }),
  ],
});
//auto update
const config = {
  repository: 'https://github.com/5pyTeam/contrat-bot',
  tempLocation: '/tmp',
  ignoreFiles: [
    'settings.json',
    'error.log',
    'combined.log',
    'data.json',
  ],
  executeOnComplete: './finish.sh',
  exitOnComplete: true,
};
module.exports = { utils, logger };
