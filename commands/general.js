// file      : commands/general.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

module.exports = {
	name: 'general',
	description: 'Display general information about a player.',
	execute(msg, args) {
		// no player name given as argument
		if (args.length < 1) {
			msg.reply('you have not specified a player name.');
			return;
		}

		const data = [];
		data.push('**Name**  ' + args[0]);
		msg.channel.send(data, { split: true });
	},
};
