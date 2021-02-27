const { Client, Collection } = require('discord.js');
const { prefixes } = require('../config.json');

module.exports = class extends Client {
	constructor(config) {
		super({
			// disableEveryone: true,
			disabledEvents: ['TYPING_START'],
		});

		this.commands = new Collection();

		this.queue = new Map();

		this.prefix = prefixes['!'];

		this.config = config;
	}
};