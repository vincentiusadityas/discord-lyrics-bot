// const ytdl = require('ytdl-core-discord');
const ytdl = require('ytdl-core')
const path = require('path');
const { sendMusicEmbeds, formatTime } = require('../lib/utils')

module.exports = {
    name: 'play',
    description: 'Play sounds from a youtube video.',
    async execute(msg, args) {
        args = args.join(' ')
            
        console.log(msg.author)
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
            // console.log(song_info.videoDetails)

            const song = {
                requester: msg.author.username,
                requester_id: msg.author.id,
                title: song_info.videoDetails.title,
                url: song_info.videoDetails.video_url,
                length: formatTime(song_info.videoDetails.lengthSeconds)
            };

            // console.log(song)

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
                    await this.playSong(msg, server_music_queue_contract.song_list[0])
                    
                } catch (error) {
                    console.log(error);
                    server_queue.delete(msg.guild.id);
                    return msg.channel.send(error)
                }

            } else {
                server_music_queue.song_list.push(song)
                return msg.channel.send(
                    `\:pencil: \`${song.title} [${song.length}]\` **has been added to the queue** by <@${song.requester_id}>!`
                  );
            }

        } catch (error) {
            console.log(error);
            msg.channel.send(error.message);
        }
    },
    async playSong(msg, song) {
        const server_queue = msg.client.queue;
        const server_music_queue = server_queue.get(msg.guild.id);

        if (!song) {
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
                // const data = { 
                //     "author": `Now Playing [@${song.requester}]`,
                //     "title": song.title,
                //     "url": song.url,
                //     // "description": lyric,
                //  }
                //  sendMusicEmbeds(data, msg.channel)
            })
            .on('finish', async () => {
                server_music_queue.song_list.shift();
                const next_song = server_music_queue.song_list[0];
                if (next_song) {
                    msg.channel.send(`Next on queue: **${next_song.title}**`)
                }
                await this.playSong(msg, next_song)
            })
            .on('error', (error) => console.log(error))
            .on('debug', console.log)

        dispatcher.setVolumeLogarithmic(server_music_queue.volume / 5);
    }
}