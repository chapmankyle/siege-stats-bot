// file      : commands/help.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

module.exports = {
	name: 'help',
	description: 'Display help information.',
	execute(msg, args) {
		const data = [];
		const { commands } = msg.client;

		data.push('The following commands are available:');
		data.push(commands.map(command => '* `' + command.name + '` - ' + command.description).join('\n'));

		msg.channel.send(data, { split: true });
	},
};
