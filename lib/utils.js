const { MessageEmbed } = require('discord.js');

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const sendEmbeds = async (data, channel) => {
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
                    .setDescription(chunk);

        await channel.send({ embed }); // Wait for the embed to be sent
    }
}

module.exports = { sendEmbeds };