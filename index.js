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
                        ],
                        "contrat.info":
                        [
                            {"name":"mention de l'utilisateur","description": "mention de l'utilisateur que tu veut inspecter"}
                        ]
                    }
//reminders for when does the player is dmed
const reminders = [7,3,1]
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
    console.log(params.length);
    if(command == 'ping')
    {
        message.reply('pong');
    }else if(command == 'contrat.add' || command == 'contrat.update')
    {
        if((params.length == 2 || params.length == 3) && params[1].match(regexDate) && memberMentions.size == 1)
        {
            const name = memberMentions.first().username;
            const id = memberMentions.first().id;
            var date = new Date();
            if(params.length == 3)
            {
                date = new Date(params[2]);
                console.log("salut");
            }
            if(date)
            {
                const data = JSON.parse(`{"date" : "${new Date().toString()}", "length": "${params[1]}"}`);
                changeJson(id,data);
                message.channel.send(`le contrat pour ${name} à été ${command == 'contrat.update' ? `mis à jour pour ${params[1].split('')[0]} ${params[1].split('')[1] == 'm' ? 'mois': 'années'}`: `crée`}`)
            }else {
            message.channel.send('la date spécifiée n\'est pas valide');
            }
        }else
        {
            showHelp(message.channel,'contrat.add');
        }
    }else if(command == 'contrat.verify')
    {
        verifyContracts();
    }else if(command == 'contrat.info')
    {
        if(memberMentions.size == 1)
        {
            const id = memberMentions.first().id;
            const infos = jsonData[id];
            if(infos)
            {
                const date = new Date(infos.date)
                const messageContent = `\`\`\`date du contrat: ${date.toLocaleDateString()}\ndurée du contrat: ${infos.length}`
                message.channel.send(`informations du contrat de ${memberMentions.first().username} \n ${messageContent}\`\`\``);
            }else
            {
                message.channel.send(`${memberMentions.first().username} n'a actuellement aucun contrat dans la structure. dommage...`);
            }
        }else{
            showHelp(message.channel,command)
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
function verifyContracts()
{
    for(var id in jsonData)
    {
       const member = globalGuild.member(id);
       const date = new Date(jsonData[id].date);
       const type= jsonData[id].length.split('')[1];
       const length = parseInt(jsonData[id].length.split('')[0]);
       const expireDate = new Date(jsonData[id].date);
       console.log(`------${member.user.username}--------`);
       console.log(`contract date: ${date.toLocaleDateString()}`);
       console.log(`contract length: ${length}${type}`);
       if(type == 'm')
       {
           expireDate.setMonth(expireDate.getMonth() + length);
        }else {
            expireDate.setFullYear(date.getFullYear() + length);
        }
        expireDate.setHours(0,0,0,0);
        const current = new Date();
        current.setHours(0,0,0,0);
        const left = current - expireDate;
        console.log(`left: ${left}`);
        reminders.forEach(value => {
            if(value == left)
            {
                member.send(`Salut ton contrat dans la 5py team va expirer dans ${reminder[i]}. N'oublie pas de le renouveler(pour cela contacte un staff)!`);
                return;
            }
        })
        if(left === 0)
        {
            member.send(' Salut ton contrat vient d\'expirer ! 😱 renouvel le vite (contacte un staff)')
        }
    }
}
cron.schedule('30 16 * * *', () => {
    verifyContracts();
});
client.login('NzA5MDA1MDU0NzA2NzEyNjA4.Xsq-zA.Ef30UqetAgOPhNb-3Sn8yRIBw4o');
