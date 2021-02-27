const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Help message to let user know what the app is.',
    execute(msg, args) {
      msg.channel.send(`\:question: **Hello!** *I am a music bot. Here is my list of commands:*`);
      const description = `
      \`1.\` *${msg.client.prefix}setting prefix <new_prefix>:* Change the prefix of commands.\n\
      \`2.\` *${msg.client.prefix}lyrics <song_title_song_artist>:* Fetch lyrics of a song.\n\
      \`3.\` *${msg.client.prefix}play <youtube_url>:* Fetch and play audio from youtube.\n\
      \`4.\` *${msg.client.prefix}skip:* Skip a song in the queue.\n\
      \`5.\` *${msg.client.prefix}stop:* Stop all songs.\n\
      \`5.\` *${msg.client.prefix}queue:* Take a look at the song queue.\n\
      `
      let embed = new MessageEmbed()
                // Set the color of the embed
                .setDescription(description)
      msg.channel.send(embed)
    },
};