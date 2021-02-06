// file      : commands/seasonal.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: 'seasonal',
	description: 'Display current seasonal information about a player.',
	execute(msg, args, ticket, sessionId) {
		// no player name given as argument
		if (args.length < 1) {
			msg.reply('you have not specified a seasonal type. Try something like `!ss seasonal ranked`');
			return;
		}

		const commandName = args.shift().toLowerCase();

		// create collection to store files
		const types = new Discord.Collection();

		// read separate command files
		const commandFiles = fs.readdirSync('./commands/season').filter(file => file.endsWith('.js'));

		// register available commands
		for (const file of commandFiles) {
			const command = require(`./season/${file}`);
			types.set(command.name, command);
		}

		// no existing command
		if (!types.has(commandName)) {
			msg.reply(`\`${commandName}\` is not a recognized command!`);
			return;
		}

		const cmd = types.get(commandName);

		// attempt to execute command
		try {
			cmd.execute(msg, args, ticket, sessionId);
		}
		catch (error) {
			console.error(error);
			msg.reply(`Error executing command \`${commandName}\`!`);
		}
	},
};
