const { MessageEmbed } = require('discord.js');
const { searchSong, getLyric } = require('../lib/genius_api/fetcher')

module.exports = {
    name: '!lyric',
    description: 'Get lyric of a song!',
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '0x';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    async execute(msg, args) {
        args = args.join(' ')
        if (args !== "") {
            msg.channel.send("Here is the lyric")
            console.log(args)
            const result = await searchSong(args)
            console.log(result)
            const lyric = await getLyric(result.url)

            const randomColor = Math.floor(Math.random()*16777215).toString(16);
            if (lyric !== "") {
                const embed = new MessageEmbed()
                    // Set the title of the field
                    .setTitle(result.full_title)
                    // Set the color of the embed
                    .setColor(this.getRandomColor())
                    // Set the main content of the embed
                    .setDescription(lyric);
                msg.channel.send(embed)
            } else {
                msg.channel.send("Cannot find lyric for " + args)
            }

        } else {
            msg.channel.send("Please write the song's title or artist")
        }
    },
};