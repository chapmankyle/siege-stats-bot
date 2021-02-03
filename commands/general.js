// file      : commands/general.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

const axios = require('axios').default;

module.exports = {
	name: 'general',
	description: 'Display general information about a player.',
	execute(msg, args) {
		// no player name given as argument
		if (args.length < 1) {
			msg.reply('you have not specified a player name.');
			return;
		}

		const username = args[0];
		const appId = '3587dcbb-7f81-457c-9781-0e3f29f6f56a';

		axios.get(`https://public-ubiservices.ubi.com/v3/profiles?namesOnPlatform=${username}&platformType=uplay`, {
			headers: {
				'Authorization': process.env.UBI_TOKEN,
				'Ubi-AppId': appId,
			},
		}).then(resp => {
			const matches = resp.data.profiles;

			// no user found
			if (matches.length < 1) {
				msg.reply(`No such user with name \`${username}\``);
				return;
			}

			// use first profile found
			const profile = matches[0];

			// grab identifiers
			const profileId = profile.userId;
			const profileName = profile.nameOnPlatform;

			// show information
			const data = [];

			data.push(`**Name**\t\t ${profileName}`);
			data.push(`**Uplay ID**\t${profileId}`);

			// send message
			msg.channel.send(data, {
				split: true,
				files: [
					`https://ubisoft-avatars.akamaized.net/${profileId}/default_146_146.png?appId=${appId}`,
				],
			});
		}).catch(err => {
			console.error(err);
		});
	},
};
