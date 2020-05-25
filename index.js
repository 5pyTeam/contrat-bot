const cron  = require("node-cron")
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const prefix = '!';
const dataPath = 'data.json';
var globalGuild;
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
    globalGuild = guild;
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
            const id = memberMentions.first().id;
            const data = JSON.parse(`{"date" : "${new Date().toString()}", "length": "${params[1]}"}`);
            changeJson(id,data);
            message.channel.send(`le contrat pour ${name} à été mis à jour pour ${params[1].split(1)[0]} ${params[1].split(1)[1] == 'm' ? 'mois': 'années'}`)
        }else
        {
            showHelp(message.channel,'contrat.add');
        }
    }else if(command == 'contrat.verify')
    {
        verifyContracts();
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
function verifyContracts()
{

    for(var id in jsonData)
    {
       const member = globalGuild.member(id);
       const date = Date.parse(jsonData[id].date);
       const type= jsonData[id].length.split(1)[1];
       const length = parseInt(jsonData[id].length.split(1)[0]);
       const expireDate = date;
       if(type == 'm')
        {
            expireDate.setMonth(expireDate.getMonth() + length);
        }else {
            expireDate.setFullYear(expireDate.getFullYear() + length);
        }
        console.log(expireDate.toString());
    }
}
cron.schedule('30 16 * * *', () => {
    
})
client.login('NzA5MDA1MDU0NzA2NzEyNjA4.Xsq-zA.Ef30UqetAgOPhNb-3Sn8yRIBw4o');
