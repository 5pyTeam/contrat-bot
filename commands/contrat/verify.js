const { Command } = require('discord.js-commando');
const moment = require('moment');
const fs = require('fs');
const { utils, logger } = require('../../utils');
const { Guild } = require('discord.js');
module.exports = class VerifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'contrat.verify',
      group: 'contrat',
      description:"verify contracts of the server",
      memberName: 'contrat.verify',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }
  run(message) {
    utils.verifyContractOfGuild(message.guild)
  }
};
