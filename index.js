const commando = require('discord.js-commando');
const fs = require('fs');
const { logger } = require('./utils');
var settings;
var start = true;
if (!fs.existsSync('settings.json')) {
  fs.writeFileSync(
    'settings.json',
    '{"dataPath": "your data path here", "token": "your token here"}',
  );
  console.log(
    'a settings.json file was created, you need now to configure it',
  );
  start = false;
} else {
  settings = JSON.parse(fs.readFileSync('./settings.json'));
  if (!fs.existsSync(settings.dataPath)) {
    fs.writeFileSync(settings.dataPath, '{}');
  }
}
if (start) {
  const path = require('path');
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
}
