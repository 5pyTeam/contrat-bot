const commando = require('discord.js-commando');
const commandExists = require('command-exists');
const path = require('path');
const fs = require('fs');
const { logger, utils } = require('./utils');
var settings;

//
//
//----------check if all files exists and create them if not--------------------
//
//
commandExists('ls', function (err, commandExists) {
  if (err) logger.error(err);
  if (!commandExists) {
    throw error(
      'you need to install prettier globally by running: npm install -g prettier',
    );
  }
});
if (!fs.existsSync('settings.json')) {
  fs.writeFileSync(
    'settings.json',
    '{"dataPath": "your data path",  "token": "your token","reminderMessages": {"server id" :[{"dayLeft": "7","message":"You have 7 days left"}]}}',
  );
  utils.prettierFile('settings.json');
  throw error(
    'a settings.json file was created, you need now to configure it',
  );
} else {
  settings = JSON.parse(fs.readFileSync('./settings.json'));
  if (!fs.existsSync(settings.dataPath)) {
    fs.writeFileSync(settings.dataPath, '{}');
  }
}
//
//
//------------------------commando init-------------------------------
//
//
try {
  const client = new commando.CommandoClient({
    CommandPrefix: '!',
    owner: '349253471490539520',
    unknowCommandResponse: false,
  });
  client.registry
    .registerDefaultTypes()
    .registerGroups([
      ['contrat', 'contrat system'],
      ['second', 'Your Second Command Group'],
    ])
    .registerDefaultGroups()
    //.registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));
  client.once('ready', () => {
    logger.info(
      `Logged in as ${client.user.tag}! (${client.user.id})`,
    );
    client.user.setActivity('être un robot');
  });
  function sendMp(memberId, message) {
    client.member.id.fetch(memberId).send(message);
  }
  client.on('error', logger.error);
  client.login(settings.token);
} catch (err) {
  logger.error(err);
}
