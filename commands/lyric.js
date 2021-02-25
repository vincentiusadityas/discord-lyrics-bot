const { MessageEmbed } = require('discord.js');
const { searchSong, getLyric } = require('../lib/genius_api/fetcher')
const { sendEmbeds } = require('../lib/utils')

module.exports = {
    name: 'lyric',
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
            msg.channel.send("Fetching your lyrics, please wait...")
            console.log(args)
            const result = await searchSong(args)
            console.log(result)
            const lyric = await getLyric(result.url)

            if (lyric !== "") {
                const data = { 
                                "title": result.full_title,
                                "description": lyric,
                                "url": result.url
                             }
                sendEmbeds(data, msg.channel)
            } else {
                msg.channel.send("Cannot find lyric for " + args)
            }

        } else {
            msg.channel.send("Please write the song's title or artist")
        }
    },
};