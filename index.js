const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const client = new CommandoClient({
  CommandPrefix: '!',
  owner: '349253471490539520',
});
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['first', 'Your First Command Group'],
    ['second', 'Your Second Command Group'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  client.user.setActivity('with Commando');
});

client.on('error', console.error);
client.login('NzA5MDA1MDU0NzA2NzEyNjA4.XxhYuQ.RA7PSPj4KHbIRq9PVmqIYj2CA3M');
