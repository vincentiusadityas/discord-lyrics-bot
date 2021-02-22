require('dotenv').config();
const { Client, Collection, MessageEmbed } = require('discord.js');
const botCommands = require('./commands');

const bot = new Client();
bot.commands = new Collection();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.login(DISCORD_BOT_TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

// bot.on('message', msg => {
//     if (msg.content === 'ping') {
//         msg.reply('pong');
//         msg.channel.send('pong');
//     }

//     if (msg.content.startsWith('!lyric')) {
//         constconsole.log(msg.content.split(/ +/))
//     }

//     if (msg.content === 'how to embed') {
//         // We can create embeds using the MessageEmbed constructor
//         // Read more about all that you can do with the constructor
//         // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
//         const embed = new MessageEmbed()
//           // Set the title of the field
//           .setTitle('A slick little embed')
//           // Set the color of the embed
//           .setColor(0xff0000)
//           // Set the main content of the embed
//           .setDescription('Hello, this is a slick embed!');
//         // Send the embed to the same channel as the message
//         msg.channel.send(embed);
//     }
// });

bot.on('message', msg => {
    const args = msg.content.split(/ +/);
    const command = args.shift().toLowerCase();
    console.info(`Called command: ${command}`);
  
    if (!bot.commands.has(command)) return;
  
    try {
        bot.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});