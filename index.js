require('dotenv').config();
// const { Client, Collection, MessageEmbed } = require('discord.js');
const Client = require('./lib/client')
const botCommands = require('./commands');
const { prefixes } = require('./config.json');

const bot = new Client();
// bot.commands = new Collection();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

const music_commands = ["play", "skip", "stop"]

let prefix = prefixes['!']

bot.login(DISCORD_BOT_TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

const queue = new Map();

bot.on('message', async (msg) => {
    
    if (msg.author.bot) return;
    
    const args = msg.content.split(/ +/);
    const command = args.shift().toLowerCase();
    console.info(`Called command: ${command}`);
    // console.log(msg.guild.id)

    const cmd_prefix = command.charAt(0)
    const cmd = command.substring(1)

    if (!bot.commands.has(cmd) || cmd_prefix !== prefix) return;
    
    const server_music_queue = queue.get(msg.guild.id);

    try {
        // if (music_commands.includes(cmd)) {
        //     bot.commands.get(cmd).execute(msg, args, server_music_queue);
        //     return;
        // } else {
            bot.commands.get(cmd).execute(msg, args);
            return;
        // }
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});