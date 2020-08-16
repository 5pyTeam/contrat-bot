const commando = require('discord.js-commando');
const fs = require('fs');
const { logger } = require('./utils');
var settings;
var start = true;
if (!fs.existsSync('settings.json')) {
  fs.writeFileSync(
    'settings.json',
    '{"dataPath": "your data path here", "token": "your token here"}',
  );
  console.log(
    'a settings.json file was created, you need now to configure it',
  );
  start = false;
} else {
  settings = JSON.parse(fs.readFileSync('./settings.json'));
  if (!fs.existsSync(settings.dataPath)) {
    fs.writeFileSync(settings.dataPath, '{}');
  }
}
if (start) {
  const path = require('path');
  const client = new commando.CommandoClient({
    CommandPrefix: '!',
    owner: '349253471490539520',
    unknowCommandResponse: false,
  });
  client.registry
    .registerDefaultTypes()
    .registerGroups([
      ['contrat', 'contrat system'],
      ['second', 'Your Second Command Group'],
    ])
    .registerDefaultGroups()
    //.registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));
  client.once('ready', () => {
    logger.info(
      `Logged in as ${client.user.tag}! (${client.user.id})`,
    );
    client.user.setActivity('être un robot');
  });
  function sendMp(memberId, message) {
    client.member.id.fetch(memberId).send(message);
  }
  client.on('error', logger.error);
  client.login(settings.token);
}
=======
const cron  = require("node-cron")
const Discord = require("discord.js");
const fs = require("fs");
const moment = require("moment");
const pino = require("pino");
const client = new Discord.Client();
const prefix = '!';
const settings = JSON.parse(fs.readFileSync('settings.json'));
const dataPath = settings["dataFileLocation"];
if(!fs.existsSync(dataPath))
{
    console.error("le chemin du fichier de donnée est invalide");
}
var globalGuild;
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
let jsonData = JSON.parse(fs.readFileSync(dataPath));
const access = ['【Président】', '【Vice-Président】','【Staff】'];
const defaultEmbed = new Discord.MessageEmbed()
    .setTitle('commande non valide')
    .setDescription('la commande spécifée n\'est pas valide, veuillez spécififer les paramètres ci-dessous');
const commandsWithParams = {"contrat.add":
                        [
                            {"name":"Mention de l'utilisateur","description": "Mention de l'utilisateur qui vient de remplir son contrat"},
                            {"name":"Durée du contrat", "description":"Durée du contrat du membre(**m** pour mois et **y** pour année)"},
                            {"name":"Date de signature", "description":"Date de signature de contrat(format DD:MM:YYYY). Si non spécifé alors la date actuelle est prise en compte"}
                        ],
                        "contrat.info":
                        [
                            {"name":"mention de l'utilisateur","description": "mention de l'utilisateur que tu veut inspecter"}
                        ],
                        "contrat.delete":
                        [
                            {"name":"mention de l'utilisateur","description:":"mention de l'utilisateur qui supprime son contrat"}
                        ]
                    }
//reminders for when does the player is dmed
const remindersWithMessage = {
    "7": "\n━━━━━━━━━━━ \n\n**Salut,** \n\nTon contrat au sein de la structure 5py expirera dans 7 jours! Tu peux décider de:\n\n``Le renouveler``\nDans ce cas adresse toi directement à Wrath en MP.\n\n``Ne pas le renouveler``\n Dans ce cas tu ne seras plus considéré comme un membre de la structure. Sur le serveur tu perdras le grade pour lequel tu as signé mais tu auras toujours le rôle visiteur et les rôles des jeux que tu souhaites.A tous moment tu pourras re - postuler pour le rôle que tu avais avant l'échéance de ton contrat, ou alors postuler pour un autre rôle au sein de la 5py.\n\n**En attendant de tes nouvelles, nous te souhaitons une bonne après-midi!\nL'équipe de la 5py**\n\n━━━━━━━━━━━",
    "3": "\n━━━━━━━━━━━ \n\n**Hello,**\n\nTon contrat au sein de la structure 5py expirera dans 3 jours! Il est bientôt temps de prendre ta décision et en faire part à Wrath !\n\n**Bonne journée,\nL'équipe de la 5py**\n\n━━━━━━━━━━━",
    "1": "\n━━━━━━━━━━━ \n\n**Bonjour,**\n\nTon contrat au sein de la structure 5py expirera dans 1 jour! Le temps presse et tu n'as plus beaucoup de temps pour prendre ta décision et en faire part à Wrath ! \n\n**Bonne après-midi,\nL'équipe de la 5py**\n\n━━━━━━━━━━━"
}
const messages = {
    "add": "\n━━━━━━━━━━━\n\n**Salut,**\n\nNous te souhaitons la bienvenue au sein de la 5py! Pour rappel tu as choisi une durée de {number}, ton contrat est donc valide jusqu'au {expireDate} (Tu recevras un message de rappel lorsque que la fin de validité de ton contrat approchera )\n\n*Nous espérons que la collaboration se passera bien et que ton expérience au sein de la structure sera bonne.*\n\n**Cordialement,\nL'équipe de la 5py**\n\n━━━━━━━━━━━",
    "update": "Dans le précédent message, une erreur de date c'est glissée lors de l'indication de la date d'échéance du contrat !\n Voici cette fois-ci la date d'échéance correct de ton contrat :``{expireDate}``\n\n **Toutes nos excuses,\nLe staff de la 5py**",
    "updatea": "\n━━━━━━━━━━━\n\n**Salut,**\n\nTu as choisis de renouveler ton contrat et nous sommes content que notre collaboration continue ! Pour rappel, tu as prolongé ton contrat de {number} mois, il est donc valide jusqu'au {expireDate}\n\n**Merci d'avoir choisi de poursuivre l'aventure avec nous,\nL'équipe de la 5py**\n\n━━━━━━━━━━━",
    "delete": "\n━━━━━━━━━━━\n\n **Salut,**\n\nTu as décidé de ne pas renouveler ton contrat et nous prenons acte de ta décision ! Au nom du Président, du Vice- Président et des membres du Staff, nous te remercions d'avoir partagé l'aventure avec nous et nous espérons que ton expérience au sein de celle - ci fût bonne! N'oublie pas que tu as la possibilité de repostuler pour un rôle au sein de la structure et que tu gardes le rôle visiteurs ainsi que les rôles des jeux que tu as choisis pour garder l'accès au salons dédiés.\n\n**Bonne continuation,\nL'équipe de la 5p**\n\n━━━━━━━━━━━"
}
client.once('ready', () => {
    logger.info('Ready!');
});
const regexDate = /\d(y|M)/;
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
    const isAccesible = asAccess(member);
    if(String(command).startsWith('contrat') && !isAccesible)
    {
        message.channel.send(`vous n'avez pas le droit d'effectuer cette commande`)
        return;
    }
    if(command == 'ping')
    {
        message.reply('pong');
    }else if(command == 'contrat.add' || command == 'contrat.update')
    {
        if((params.length == 2 || params.length == 3) && params[1].match(regexDate) && memberMentions.size == 1)
        {
            const name = memberMentions.first().username;
            const id = memberMentions.first().id;
            var date = moment(); 
            if(params.length == 3)
            {
                date = moment(params[2],'DD.MM.YYYY');
                console.log("salut");
            }
            logger.debug(date);
            if(date.isValid())
            {
                const data = JSON.parse(`{"date" : "${date.format()}", "length": "${params[1]}"}`);
                changeJson(id,data);
                if(command == 'contrat.add')
                    logger.info(`created a new contract for ${name}`);            
                const length = parseInt(params[1].split('')[0]);
                const type = params[1].split('')[1];
                const expireDate = date.add(length,type);
                logger.debug(`date: ${date}, expireDate: ${expireDate}`);
                var toSend = command == 'contrat.update'?messages["update"]:messages["add"];
                toSend = toSend.replace(/{number}/,`${length} ${length>1? type =='y'?'années' : 'mois' : type == 'y' ? 'année':'mois'}`);
                toSend = toSend.replace(/{expireDate}/,expireDate.format('DD.MM.YYYY'));
                memberMentions.first().send(toSend);
                message.channel.send(`le contrat pour ${name} à été ${command == 'contrat.update' ? `mis à jour pour ${params[1].split('')[0]} ${params[1].split('')[1] == 'M' ? 'mois': 'années'}`: `crée`}`)
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
                const date = moment(infos.date)
                const messageContent = `\`\`\`date du contrat: ${date.format('DD.MM.YYYY')}\ndurée du contrat: ${infos.length}\`\`\``
                message.channel.send(`informations du contrat de ${memberMentions.first().username} \n ${messageContent}`);
            }else
            {
                message.channel.send(`${memberMentions.first().username} n'a actuellement aucun contrat dans la structure. dommage...`);
            }
        }else{
            showHelp(message.channel,command);
        }
    }else if(command == 'contrat.delete')
    {
        console.log(memberMentions.size);
        if(memberMentions.size >= 1)
        {
            for(member in memberMentions)
            {
                console.log('a');
                const user = memberMentions[member];
                deleteJson(user.id);
                user.send(messages["delete"]);
            }
        }else
        {
            showHelp(message.channel,command);
        }
    }    
});
function asAccess(member)
{
    for(var i = 0; i < access.length;i++)
    {
        if(access[i] == member.roles.highest.name)
        return true;
    }
    return false;
}
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
function deleteJson(rank)
{
    delete jsonData[rank];
    fs.writeFileSync(dataPath,JSON.stringify(jsonData));
}
function verifyContracts()
{
    logger.debug('verifying contracts');
    for(var id in jsonData)
    {
        const member = globalGuild.member(id);
        const date = moment(jsonData[id].date);
        const type= jsonData[id].length.split('')[1];
        const length = parseInt(jsonData[id].length.split('')[0]);
        const expireDate = moment(date);
        logger.debug(`------${member.user.username}--------`);
        logger.debug(`contract date: ${date.format('DD.MM.YYYY')}`);
        logger.debug(`contract length: ${length}${type}`);
        expireDate.add(length,type); 
        const left = expireDate.diff(moment(), 'days') + 1;
        logger.debug(`left: ${left}`);        
        for(var value in remindersWithMessage)
        {
            if(parseInt(value) == left)
            {
                member.send(remindersWithMessage[value]);
                logger.info(`sending dm to ${member.user.username} because he has ${left} days left`);
            }
        }
    }
}
cron.schedule('30 16 * * *', () => {
    verifyContracts();
});
client.login('NzA5MDA1MDU0NzA2NzEyNjA4.XxhYuQ.RA7PSPj4KHbIRq9PVmqIYj2CA3M');
