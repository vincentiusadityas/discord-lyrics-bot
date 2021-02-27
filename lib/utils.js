const { MessageEmbed } = require('discord.js');

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

module.exports = { sendLyricsEmbeds, sendMusicEmbeds, formatTime };