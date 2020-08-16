const { Command } = require('discord.js-commando');
const moment = require('moment');
const cron = require('node-cron');
const fs = require('fs');
const { utils, logger } = require('../../utils');
const { Guild } = require('discord.js');
module.exports = class VerifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'contrat.verify',
      group: 'contrat',
      description: 'verify contracts of the server',
      memberName: 'contrat.verify',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }
  run(message) {
    utils.verifyContractOfGuild(message.guild);
  }
};
cron.schedule('30 16 * * *', () => {
  for (var guild in data) {
    utils.verifyContractOfGuild(guild);
  }
});
