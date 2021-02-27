module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(msg, args) {
      msg.channel.send(`\:exclamation: **pong** \:ping_pong:`);
    },
};