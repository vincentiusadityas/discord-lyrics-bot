module.exports = {
	name: 'skip',
	description: 'Skip a song!',
	execute(msg) {
        const server_queue = msg.client.queue;
        const server_music_queue = server_queue.get(msg.guild.id);

		if (!msg.member.voice.channel) return msg.channel.send(`\:x: **You need to be in a voice channel to skip a song!**`);
		if (!server_music_queue) return msg.channel.send(`\:pensive: **You haven't even played me..**`);

		server_music_queue.connection.dispatcher.end();
		
		const song = server_music_queue.song_list[0]
		msg.channel.send(`\:fast_forward: **Skipped** \`${song.title} [${song.length}]\``)
	},
};