const { Command } = require('discord.js-commando');
const moment = require('moment');
const fs = require('fs');
const { utils } = require('../../utils');
const { Guild } = require('discord.js');
module.exports = class VerifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'contrat.verify',
      group: 'contrat',
      memberName: 'contrat.verify',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }
  run(message) {}
};
