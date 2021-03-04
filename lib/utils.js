const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const sendLyricsEmbeds = async (data, channel) => {
    const arr = data.description.match(/(.|[\r\n]){1,2048}/g); // Build the array
    const color = getRandomColor()

    for (let chunk of arr) { // Loop through every element
        let embed = new MessageEmbed()
                    // Set the title of the field
                    .setTitle(data.title)
                    // Set the url of the field
                    .setURL(data.url)
                    // Set the color of the embed
                    .setColor(color)
                    // Set the main content of the embed
                    .setDescription(chunk)
                    // Set the footer of the embed
                    .setFooter(`*Lyrics provided by genius.com*`);

        await channel.send({ embed }); // Wait for the embed to be sent
    }
}

const sendMusicEmbeds = async (data, channel) => {
    const color = getRandomColor()

    let embed = new MessageEmbed()
                .setAuthor(data.author)
                // Set the title of the field
                .setTitle(data.title)
                // Set the url of the field
                .setURL(data.url)
                // Set the color of the embed
                .setColor(color)

    await channel.send({ embed }); // Wait for the embed to be sent
}

const generateQueueEmbed = (start_idx, data) => {
    const color = getRandomColor()

    const current = data.slice(start_idx, start_idx+10);
    let descr = current.join("")

    let embed = new MessageEmbed()
                // Set the color of the embed
                .setDescription(descr)
                // Set the color of the embed   
                .setColor(color)

    return embed;

}

const sendQueueEmbeds = async (data, msg) => {
    const author = msg.author;
    await msg.channel.send(generateQueueEmbed(0, data)).then(msg => {
        
        if (data.length <= 10) return;

        msg.react('➡️');
        const collector = msg.createReactionCollector(
            // only collect left and right arrow reactions from the message author
            (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
            // time out after a minute
            {time: 60000}
        )

        let currIdx = 0
        collector.on('collect', reaction => {
            // remove the existing reactions
            msg.reactions.removeAll().then(async () => {
                // increase/decrease index
                reaction.emoji.name === '⬅️' ? currIdx -= 10 : currIdx += 10
                // edit message with new embed
                msg.edit(generateQueueEmbed(currIdx, data))
                // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                if (currIdx !== 0) await msg.react('⬅️')
                // react with right arrow if it isn't the end
                if (currIdx + 10 < data.length) msg.react('➡️')
            })
        })
        
    })
}

const sendYtsrEmbed = async (data, msg) => {
    const color = getRandomColor()
    const user_msg = msg;
    let search_list = []

    data.forEach((item, idx) => {
        search_list.push(`\`${idx}.\` **${item.title}** \`[${item.duration}]\` from channel *\`${item.author.name}\`*\n`)
    })

    const descr = search_list.join("")

    let embed = new MessageEmbed()
                // Set the color of the embed
                .setDescription(descr)
                // Set the color of the embed   
                .setColor(color)

    const numbers = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
    const author = msg.author;

    msg.channel.send(`\:clipboard: <@${author.id}>, **Here is the top 10 result from our search. Choose one by clicking the emoji below!**`)

    return await msg.channel.send(embed).then(msg => {
        numbers.forEach((item) =>{
            msg.react(item)
        })

        const collector = msg.createReactionCollector(

            (reaction, user) => numbers.includes(reaction.emoji.name) && user.id === author.id,
            // time out after a minute
            {time: 60000}
        )

        collector.on('collect', reaction => {
            // remove the existing reactions
            msg.reactions.removeAll().then(async () => {
                // increase/decrease index
                let idx = -1
                numbers.includes(reaction.emoji.name) ? idx = numbers.indexOf(reaction.emoji.name) : idx = -1
                
                // edit message with new embed
                embed = new MessageEmbed()
                    .setTitle(`Selection ${idx} is chosen.`)
                    // Set the color of the embed
                    .setDescription(search_list[idx])
                    // Set the color of the embed   
                    .setColor(color)
                msg.edit(embed)
                executeAfterReaction(user_msg, data[idx].url)
            })
        })
    })
}

const executeAfterReaction = async (msg, args) =>{
    try {
        const server_queue = msg.client.queue;
        const server_music_queue = server_queue.get(msg.guild.id);

        const voice_channel = msg.member.voice.channel;
        if (!voice_channel)
            return msg.channel.send(
                `\:x: **You need to be in a voice channel to play music!**`
            );

        const permissions = voice_channel.permissionsFor(msg.client.user);

        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return msg.channel.send(
                `\:x: **I need the permissions to join and speak in your voice channel!**`
            );
        }
        
        if (!args) {
            return msg.channel.send(
                `\:exclamation: **Wrong command! Try:** \`${msg.client.prefix}play <youtube_url>\``
            );
        }

        msg.channel.send(`\:mag: **Searching...** \:arrow_right: \`${args}\``)
        const song_info = await ytdl.getInfo(args);

        const song = {
            requester: msg.author.username,
            requester_id: msg.author.id,
            title: song_info.videoDetails.title,
            url: song_info.videoDetails.video_url,
            length: formatTime(song_info.videoDetails.lengthSeconds)
        };

        if (!server_music_queue) {
            const server_music_queue_contract = {
                text_channel: msg.channel,
                voice_channel: voice_channel,
                connection: null,
                song_list: [],
                volume: 5,
                playing: true
            };

            server_queue.set(msg.guild.id, server_music_queue_contract);

            server_music_queue_contract.song_list.push(song)

            try {
                await voice_channel.join()
                    .then(connection => {
                        msg.channel.send(`\:wave: **Joined** \`${connection.channel.name}\` **and** \:pushpin: **Bound To** \`${msg.channel.name}\``)
                        server_music_queue_contract.connection = connection;
                    })
                    .catch(error => {
                        console.log(error)
                    })
                await playSong(msg, server_music_queue_contract.song_list[0])
                
            } catch (error) {
                console.log(error);
                server_queue.delete(msg.guild.id);
                return msg.channel.send(`\:interrobang: **Something wrong happened :(**`);
            }

        } else {
            server_music_queue.song_list.push(song)
            return msg.channel.send(
                `\:pencil: \`${song.title} [${song.length}]\` **has been added to the queue** by <@${song.requester_id}>!`
              );
        }

    } catch (error) {
        console.log(error);
        if (error.message === "Status code: 429") {
            return msg.channel.send(`\:interrobang: **Too many requests :(**`);
        }
        return msg.channel.send(`\:interrobang: **Something wrong happened :(**`);
    }
}

const playSong = async (msg, song) => {
    const server_queue = msg.client.queue;
    const server_music_queue = server_queue.get(msg.guild.id);

    if (!song) {
        msg.channel.send(`\:door: **No songs left to play! \:wave: Leaving** \`${server_music_queue.connection.channel.name}\``);
        server_music_queue.voice_channel.leave();
        server_queue.delete(msg.guild.id);
        return;
    }

    const stream = ytdl(song.url, { 
        filter: 'audioonly', 
        quality:'highestaudio', 
        dlChunkSize: 0, 
        highWaterMark: 1 << 25 
    }).on('error', (error) => console.log(error));

    const dispatcher = server_music_queue.connection
        .play(stream)
        .on('start', () => {
            msg.channel.send(`\:arrow_forward: **Start playing:** \:musical_note: \`${song.title} [${song.length}]\``)
        })
        .on('finish', async () => {
            server_music_queue.song_list.shift();
            const next_song = server_music_queue.song_list[0];
            if (next_song) {
                msg.channel.send(`\:track_next: **Next on queue:** \`${next_song.title} [${next_song.length}]\``)
            }
            await playSong(msg, next_song)
        })
        .on('error', (error) => console.log(error))
        .on('debug', console.log)

    dispatcher.setVolumeLogarithmic(server_music_queue.volume / 5);
}

const formatTime = (d) => {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? (h < 10 ? "0" + h + ":" : h + ":") : "";
    const mDisplay = m > 0 ? (m < 10 ? "0" + m + ":" : m + ":") : "00";
    const sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";

    return hDisplay + mDisplay + sDisplay; 
}

module.exports = { sendLyricsEmbeds, sendMusicEmbeds, sendQueueEmbeds, sendYtsrEmbed, formatTime };