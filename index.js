import * as cron from "node-cron"
import * as Discord from "discord.js"
import * as fs from "fs"
const client = new Discord.Client();
const prefix = '!';
const dataPath = 'data.json'
let jsonData = JSON.parse(fs.readFileSync(dataPath));

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const content = message.content;
    const member = message.guild.member(message.member);
    const guild = message.guild;
    const memberMentions = message.mentions.members;
    const roleMentions = message.mentions.roles;
    const params = message.content.slice(prefix.length).split(' ');
    const command = params.shift().toLowerCase();
    if(command == 'ping')
    {
        message.reply('pong');
    }else if(command == 'contrat.add')
    {
        if(memberMentions.first() && params[2])
        {

        }else
        {
            message.channel.send({
                embed: {
                    title: "la commande n'est pas valide",
                    description: "veuillez spécifier tous le paramètes listés ci-dessous",
                    fields: [{
                            description: "*utilisateur:* mention de l'utilisateur qui vient de remplir sont contrat",                            
                        },
                        {
                            description: "*durée du contrat:* durée du contrat du joueur(m pour mois et y pour année)"
                        },
                    ],                    
                }
            });
        }
    }
});
function changeJson(rank, data)
{
    jsonData[rank] = data;
    fs.writeFileSync(dataPath,JSON.stringify(jsonData));
}
client.login('NzA5MDA1MDU0NzA2NzEyNjA4.Xsq-zA.Ef30UqetAgOPhNb-3Sn8yRIBw4o');
