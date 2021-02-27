module.exports = {
	name: 'stop',
	description: 'Stop the bot from playing the songs',
	execute(msg) {
        const server_queue = msg.client.queue;
        const server_music_queue = server_queue.get(msg.guild.id);

		if (!msg.member.voice.channel) return msg.channel.send('You have to be in a voice channel to stop the music!');
		if (!server_music_queue) return msg.channel.send("You haven't even played me :(");

        server_music_queue.song_list = [];
		server_music_queue.connection.dispatcher.end();
		
        msg.channel.send(`\:stop_button: All songs stopped! :thumbsup:`)
	},
};