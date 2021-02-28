// const ytdl = require('ytdl-core-discord');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const { sendMusicEmbeds, formatTime } = require('../lib/utils');

module.exports = {
    name: 'play',
    description: 'Play sounds from a youtube video.',
    async execute(msg, args) {
        args = args.join(' ')
            
        // console.log(msg.author)
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

            let song_info = "";
            let song = null;
            let playlist_songs = [];
            let playlist_detail = null;

            let isSong = false;
            let isPlaylist = false;

            if (args.includes("https://www.youtube.com/watch")) {
                msg.channel.send(`\:mag: **Searching video...** \:arrow_right: \`${args}\``)

                song_info = await ytdl.getInfo(args);
                // console.log(song_info.videoDetails)
                
                if (song_info === "") return msg.channel.send(`\:x: **Cannot find** \`${args}\`. **Try a different url or keywords!**`)

                // console.log(song)
                song = {
                    requester: msg.author.username,
                    requester_id: msg.author.id,
                    title: song_info.videoDetails.title,
                    url: song_info.videoDetails.video_url,
                    length: formatTime(song_info.videoDetails.lengthSeconds)
                };
                isSong = true;

            } else if (args.includes("https://www.youtube.com/playlist")) {
                msg.channel.send(`\:mag: **Searching playlist...** \:arrow_right: \`${args}\``)

                const playlist = await ytpl(args, { limit: 50 });

                const items = playlist.items;

                let totalLength = 0
                items.forEach((item, idx) => {
                    const a_song = {
                        requester: msg.author.username,
                        requester_id: msg.author.id,
                        title: item.title,
                        url: item.shortUrl,
                        length: formatTime(item.durationSec)
                    }
                    totalLength += parseInt(item.durationSec)
                    playlist_songs.push(a_song)
                })

                playlist_detail = {
                    requester: msg.author.username,
                    requester_id: msg.author.id,
                    title: playlist.title,
                    itemCount: playlist.estimatedItemCount,
                    id: playlist.id,
                    url: playlist.url,
                    totalLength: formatTime(totalLength)
                }

                isPlaylist = true;

            } else {
                // msg.channel.send(`\:mag: **Searching...** \:arrow_right: \`${args}\``)

                // song_info = await ytsr(args);
                // console.log(song_info['items'][0])
                return msg.channel.send(`\:exclamation: **Currently, you can only provide a youtube link!**`)
            }

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
                
                if (isSong) {
                    server_music_queue_contract.song_list.push(song)
                } else if (isPlaylist) {
                    playlist_songs.forEach((song) => {
                        server_music_queue_contract.song_list.push(song)
                    })
                    msg.channel.send(
                        `\:pencil: **Playlist** \`${playlist_detail.title} [${playlist_detail.totalLength}]\` with a total of \`${playlist_detail.itemCount} songs\` **has been added to the queue** by <@${playlist_detail.requester_id}>!`
                      );
                }

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
                    return msg.channel.send(`\:interrobang: **Something wrong happened :(**`);
                }

            } else {
                if (isSong) {
                    server_music_queue.song_list.push(song)
                    return msg.channel.send(
                        `\:pencil: \`${song.title} [${song.length}]\` **has been added to the queue** by <@${song.requester_id}>!`
                      );
                } else if (isPlaylist) {
                    playlist_songs.forEach((song) => {
                        server_music_queue.song_list.push(song)
                    })
                    return msg.channel.send(
                        `\:pencil: **Playlist** \`${playlist_detail.title} [${playlist_detail.totalLength}]\` with a total of \`${playlist_detail.itemCount} songs\` **has been added to the queue** by <@${playlist_detail.requester_id}>!`
                      );
                }
            }

        } catch (error) {
            console.log(error);

            if (error.message === "Status code: 429") {
                return msg.channel.send(`\:interrobang: **Error: Too many requests :(**`);
            } else if (error.message === "API-Error: The playlist does not exist.") {
                return msg.channel.send(`\:interrobang: **Error: The playlist is probably private :(**`);
            }
            return msg.channel.send(`\:interrobang: **Something wrong happened :(**`);
        }
    },
    async playSong(msg, song) {
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