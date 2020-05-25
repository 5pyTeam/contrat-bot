import * as cron from "node-cron"
import * as Discord from "discord.js"
import * as fs from "fs"
const client = new Discord.Client();
const prefix = '!';
const dataPath = 'data.json'
let jsonData = JSON.parse(fs.readFileSync(dataPath));

const defaultEmbed = new Discord.MessageEmbed()
    .setTitle('commande non valide')
    .setDescription('la commande spécifée n\'est pas valide, veuillez spécififer les paramètres ci-dessous');
const commandsWithParams = {"contrat.add":
                        [
                            {"name":"mention de l'utilisateur","description": "mention de l'utilisateur qui vient de remplir son contrat"},
                            {"name":"durée du contrat", "description":"durée du contrat du membre(**m** pour mois et **y** pour année)"}
                        ]
                    }
client.once('ready', () => {
    console.log('Ready!');
});
const regexDate = /\d(y|m)/;
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const content = message.content;
    const member = message.guild.member(message.member);
    const guild = message.guild;
    const memberMentions = message.mentions.users;
    const roleMentions = message.mentions.roles;
    const params = message.content.slice(prefix.length).split(' ');
    const command = params.shift().toLowerCase();
    console.log(params);
    if(command == 'ping')
    {
        message.reply('pong');
    }else if(command == 'contrat.add' || command == 'contrat.update')
    {
        if(params.length == 2 && params[1].match(regexDate) && memberMentions.size == 1)
        {
            const name = memberMentions.first().username;
            const data = JSON.parse(`{"date" : "${new Date().toString()}", "length": "${params[1]}"}`);
            changeJson(name,data);
        }else
        {
            showHelp(message.channel,'contrat.add');
        }
    }
});
function showHelp(channel, command)
{
    const newEmbed = new Discord.MessageEmbed(defaultEmbed);
    for(var value in commandsWithParams)
    {
        var g = commandsWithParams[value];
        if(command == value)
        {
            for(var i = 0; i <  g.length; i++)
            {
                newEmbed.addField(g[i].name,g[i].description, true);
            }
        }
    }
    channel.send(newEmbed);
}
function changeJson(rank, data)
{
    jsonData[rank] = data;
    fs.writeFileSync(dataPath,JSON.stringify(jsonData));
}
client.login('NzA5MDA1MDU0NzA2NzEyNjA4.Xsq-zA.Ef30UqetAgOPhNb-3Sn8yRIBw4o');
