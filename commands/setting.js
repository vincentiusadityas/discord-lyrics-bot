const { MessageEmbed } = require('discord.js');
const { prefixes } = require('../config.json');

module.exports = {
    name: 'setting',
    description: "This is a command for user to set the bot's settings",
    execute(msg, args) {

      if (args.length == 2) {
        if (args[0] == 'prefix') {
          if (Object.keys(prefixes).includes(args[1])) {
            console.log(prefixes[args[1]])
            msg.client.prefix = args[1]
            msg.channel.send(`\:white_check_mark: **Success!** Prefix changed to \`${args[1]}\``);
          } else {
            msg.channel.send(`\:x: **Error:** cannot use \`${args[1]}\` as a prefix.`);
          }
        }

      } else {

      }
      
      let embed = new MessageEmbed()
                // Set the color of the embed
                .setDescription(`\`1.\` *${msg.client.prefix}setting prefix <new_prefix>*`)
      msg.channel.send(`\:tools: **Current available settings are:**`);
      msg.channel.send(embed)
    },
};