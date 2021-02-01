// file      : commands/help.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

module.exports = {
	name: 'help',
	description: 'Command to display help information.',
	execute(msg, args) {
		msg.channel.send('Hello');
	},
};
