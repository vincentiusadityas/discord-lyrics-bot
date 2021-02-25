module.exports = {
    name: 'help',
    description: 'Help message to let user know what the app is.',
    execute(msg, args) {
      const help_msg = `Hello!\n
        I am a music bot, initially made to get song lyrics!\n
        Currently, my available commands are:\n
        \t - !lyric [song title or song artist here]`;
      msg.channel.send(help_msg);
    },
};