const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('settings.json'));
const data = JSON.parse(fs.readFileSync(settings.dataPath));
const { exec } = require('child_process');
class utils {
  /*---------------- data ---------------*/
  //
  static setData(rank, content) {
    data[rank] = content;
    this.writeDataToFile();
  }
  static getData(rank) {
    return data[rank];
  }
  static delData(rank) {
    delete data[rank];
    this.writeDataToFile();
  }
  static writeDataToFile() {
    fs.writeFileSync(settings.dataPath, JSON.stringify(data));
    exec(`prettier --write ${settings.dataPath}`, (error, stdout, stderr) => {
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
    exec('prettier --write settings.json', (error, stdout, stderr) => {
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
}
module.exports = { utils };
