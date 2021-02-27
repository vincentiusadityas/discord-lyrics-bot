module.exports = {
	name: 'skip',
	description: 'Skip a song!',
	execute(msg) {
        const server_queue = msg.client.queue;
        const server_music_queue = server_queue.get(msg.guild.id);

		if (!msg.member.voice.channel) return message.channel.send('You have to be in a voice channel to skip a song!');
		if (!server_music_queue) return message.channel.send('There is no song that I could skip!');
		
		server_music_queue.connection.dispatcher.end();
	},
};