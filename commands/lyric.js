module.exports = {
    name: '!lyric',
    description: 'Get lyric of a song!',
    execute(msg, args) {
        args = args.join(' ')
        if (args !== "") {
            msg.channel.send("Here is the lyric")
            console.log(args)
        } else {
            msg.channel.send("Please write the song's title or artist")
        }
    },
};