const { Command } = require('discord.js-commando');
const moment = require('moment');
const fs = require('fs');
const { utils } = require('../../utils');
module.exports = class AddCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'contrat.add',
      aliases: ['contrat.update'],
      group: 'contrat',
      memberName: 'contrat.add',
      description: 'add a contract',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          key: 'member',
          prompt: 'For which member would you like to add a contract?',
          type: 'member',
        },
        {
          key: 'time',
          prompt: 'what is the time of the contract',
          type: 'string',
          validate: (text) => text.match(/\d(y|M)/),
        },
        {
          key: 'date',
          prompt: 'When was the contract created?',
          type: 'string',
          validate: (text) =>
            text.match(
              /^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/
            ),
          default: moment().format('DD.MM.YYY'),
        },
      ],
    });
  }
  run(message, { member, time, date }) {
    const id = member.id;
    console.log(time);
    const newDate = moment(date, 'DD.MM.YYYY');
    const data = JSON.parse(
      `{"date": "${newDate.format()}", "length": "${time}","info": {"name": "${
        member.user.username
      }","tag": "${member.user.tag}"
      }}`
    );
    utils.setData(id, data);
    var type = '';
    if (String(message.content).indexOf('update') != -1) type = 'updated';
    else type = 'added a';
    message.say(`sucessfully ${type} contract for ${member.user.username}`);
  }
};
