const { Command } = require('discord.js-commando');
const moment = require('moment');
const fs = require('fs');
const { utils } = require('../../utils');
module.exports = class AddCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'contrat.delete',
      group: 'contrat',
      memberName: 'contrat.delete',
      description: 'delete a contract',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          key: 'member',
          prompt: 'Which member do you want to delete ?',
          type: 'member',
        },
      ],
    });
  }
  run(message, { member }) {
    utils.delData(member.id);
    message.say(`contract deleted for ${member.user.username}`);
  }
};
