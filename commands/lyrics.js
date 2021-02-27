const { MessageEmbed } = require('discord.js');
const { searchSong, getLyric } = require('../lib/genius_api/fetcher')
const { sendLyricsEmbeds } = require('../lib/utils')

module.exports = {
    name: 'lyrics',
    description: 'Get the lyrics of a song!',
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
            msg.channel.send(`\:timer: <@${msg.author.id}> **Fetching lyrics** of \`${args}\`...`)
            // console.log(args)
            const result = await searchSong(args)
            
            if (!result) return msg.channel.send(`\:x: **Cannot find lyrics** for \`${args}\`. **Try a different keyword!**`)
            // console.log(result)
            const lyric = await getLyric(result.url)

            if (lyric !== "") {
                const data = { 
                                "title": result.full_title,
                                "description": lyric,
                                "url": result.url,
                                "requester": msg.author.username,
                                "requester_id": msg.author.id
                             }
                sendLyricsEmbeds(data, msg.channel)
            } else {
                msg.channel.send(`\:x: **Cannot find lyrics** for \`${args}\`. **Try a different keyword!**`)
            }

        } else {
            msg.channel.send("\:exclamation: **Please write the song's title or artist** \`!lyrics <title_or_artist>\`")
        }
    },
};