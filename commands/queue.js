const { sendQueueEmbeds } = require('../lib/utils');

module.exports = {
	name: 'queue',
	description: 'Take a look at the songs queue',
	execute(msg) {
        const server_queue = msg.client.queue;
        const server_music_queue = server_queue.get(msg.guild.id);

		const voice_channel = msg.member.voice.channel;
            if (!voice_channel)
                return msg.channel.send(
                    `\:x: **You need to be in a voice channel to take a look at the queue!**`
                );
		if (!server_music_queue) return msg.channel.send(`\:x: **You currently have no songs played**`);
		
		let queue_str_list = [];
		let total_item = server_music_queue.song_list.length;
		
		if (total_item === 1) return msg.channel.send(`\:zero: **You don't have any songs left in the queue**`);

		const first_song = server_music_queue.song_list[0]
		
        server_music_queue.song_list.forEach((item, idx) => {
			if (idx === 0) return;
			queue_str_list.push(`\`${idx}.\` \`[${item.length}]\` **${item.title}** - Requested by <@${item.requester_id}>\n`)
		})

		total_item_str = (total_item-1) > 1 ? `${total_item-1} entries` : `${total_item-1} entry`
		msg.channel.send(`\:arrow_forward: **Currently playing:** \`${first_song.title} [${first_song.length}]\` - Requested by <@${first_song.requester_id}>`)
		msg.channel.send(`\:page_with_curl: **Current queue - ${total_item_str}**`);
		sendQueueEmbeds(queue_str_list, msg.channel)
	},
};