try {
  const fs = require('fs');
  if (fs.existsSync('./settings.json')) {
    const settings = JSON.parse(fs.readFileSync('settings.json'));
    if (fs.existsSync(settings.dataPath)) {
      const data = JSON.parse(fs.readFileSync(settings.dataPath));
    }
  }
} catch (err) {
  logger.error(`on utils:\n ${err}`);
}
const { exec } = require('child_process');
const {
  createLogger,
  format,
  transports,
  addColors,
} = require('winston');
const moment = require('moment');
const { RichEmbed } = require('discord.js');
const { combine, timestamp, label, prettyPrint, simple } = format;

class utils {
  //
  //
  //------------------------data-------------------------------
  //
  //
  static setData(guild, rank, content) {
    try {
      if (!data[guild]) {
        data[guild] = {};
      }
      console.log(data);
      data[guild][rank] = content;
      this.writeDataToFile();
    } catch (err) {
      logger.error(err);
    }
  }
  static getData(rank) {
    try {
      return data[rank];
    } catch (err) {
      logger.error(err);
    }
  }
  static dateSize() {
    try {
      return Object.keys(myObject).length;
    } catch (err) {
      logger.error(err);
    }
  }
  static delData(rank) {
    try {
      delete data[rank];
      this.writeDataToFile();
    } catch (err) {
      logger.error(err);
    }
  }
  static writeDataToFile() {
    try {
      fs.writeFileSync(settings.dataPath, JSON.stringify(data));
      this.prettierFile(settings.dataPath);
    } catch (err) {
      logger.error(err);
    }
  }
  //
  //
  //------------------------settings-------------------------------
  //
  //
  static getSettings(rank) {
    try {
      return settings[rank];
    } catch (err) {
      logger.error(err);
    }
  }
  static setSettings(rank, content) {
    try {
      settings[rank] = content;
      this.writeSettingsToFile();
    } catch (err) {
      logger.error(err);
    }
  }
  static writeSettingsToFile() {
    try {
      fs.writeFileSync('settings.json', JSON.stringify(settings));
      this.prettierFile('settings.json');
    } catch (err) {
      logger.error(err);
    }
  }
  //
  //
  //------------------------other-------------------------------
  //
  //
  static prettierFile(path) {
    try {
      exec(` prettier --write ${path}`, (error, stdout, stderr) => {
        if (error) {
          logger.error(error);
          return;
        }
        if (stderr) {
          logger.error(stderr);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    } catch (err) {
      logger.error(err);
    }
  }
  static verifyContractOfGuild(guild) {
    for (var id in data[guild.id]) {
      try {
        const memberName = data[guild.id][id]['info']['name'];
        const date = moment(data[guild.id][id].date);
        const type = data[guild.id][id].length.split('')[1];
        const length = parseInt(
          data[guild.id][id].length.split('')[0],
        );
        const expireDate = moment(date);
        expireDate.add(length, type);
        const left = expireDate.diff(moment(), 'days') + 1;
        logger.info(
          `{"name":"${memberName}", "made": "${date.format(
            'DD.MM.YYYY',
          )}", "length": ${length}${type}, "left": "${left}" }`,
        );
        for (var value in settings['reminderMessages'][guild.id]) {
          try {
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
          } catch (err) {
            logger.error(err);
          }
        }
      } catch (err) {
        logger.error(err);
      }
    }
  }
}
//
//
//------------------------winston-------------------------------
//
//
const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({ format: format.simple() }),
  ],
});
addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green',
});
module.exports = { utils, logger };
