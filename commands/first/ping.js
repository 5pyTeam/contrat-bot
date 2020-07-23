const { Command } = require('discord.js-commando');
module.exports = class pingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      group: 'first',
      memberName: 'ping',
      description: 'reply with pong',
    });
  }
  run(message) {
    return message.channel.send('pong');
  }
};
