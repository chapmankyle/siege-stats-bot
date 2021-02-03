// file      : commands/general.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

const Discord = require('discord.js');
const axios = require('axios').default;

const config = require('../config.json');

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
		const spaceId = '5172a557-50b5-4665-b7db-e3f2e8c5041d';

		// obtain ubisoft token and session ID
		axios.post('https://public-ubiservices.ubi.com/v3/profiles/sessions', { 'rememberMe': true }, {
			headers: {
				'Ubi-AppId': appId,
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + process.env.UBI_AUTH,
			},
		}).then(resp => {
			// get ticket and session ID
			const response = resp.data;
			const ticket = response.ticket;
			const sessionId = response.sessionId;

			axios.get(`https://public-ubiservices.ubi.com/v3/profiles?namesOnPlatform=${username}&platformType=uplay`, {
				headers: {
					'Authorization': 'Ubi_v1 t=' + ticket,
					'Ubi-AppId': appId,
					'Ubi-SessionId': sessionId,
					'Connection': 'keep-alive',
				},
			}).then(profResp => {
				const matches = profResp.data.profiles;

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

				axios.get(`https://public-ubiservices.ubi.com/v1/profiles/stats?profileIds=${profileId}&spaceId=${spaceId}`, {
					headers: {
						'Authorization': 'Ubi_v1 t=' + ticket,
						'Ubi-AppId': appId,
						'Ubi-SessionId': sessionId,
					},
				}).then(async statsResp => {
					const statistics = statsResp.data.profiles[0].stats;

					// get general statistics
					const level = statistics.ProgressionClearanceLevel.value;

					const kills = parseInt(statistics.ProgressionPvPKills.value, 10);
					const deaths = parseInt(statistics.ProgressionPvPDeath.value, 10);
					const kdr = (kills * 1.0) / (deaths * 1.0);

					const wins = parseInt(statistics.ProgressionPvPMatchesWon.value, 10);
					const losses = parseInt(statistics.ProgressionPvPMatchesLost.value, 10);
					const wlr = (wins * 1.0) / (losses * 1.0);

					const revives = statistics.ProgressionPvPRevive.value;
					const timePlayed = Math.round(parseFloat(statistics.ProgressionPvPTimePlayed.value) / 3600.0);

					const rankResp = await axios.get(`https://public-ubiservices.ubi.com/v1/spaces/${spaceId}/sandboxes/OSBOR_PC_LNCH_A/r6karma/players?board_id=pvp_ranked&season_id=-1&region_id=ncsa&profile_ids=${profileId}`, {
						headers: {
							'Authorization': 'Ubi_v1 t=' + ticket,
							'Ubi-AppId': appId,
							'Ubi-SessionId': sessionId,
						},
					});

					const rankedData = rankResp.data.players[`${profileId}`];
					const rank = rankedData.rank;
					const rankedImgURL = config.ranks[rank].img;

					// add message data
					const data = new Discord.MessageEmbed()
						.setColor('#ff6a00')
						.setAuthor(profileName, `https://ubisoft-avatars.akamaized.net/${profileId}/default_146_146.png?appId=${appId}`)
						.setDescription(`Uplay ID: ${profileId}`)
						.setThumbnail(rankedImgURL)
						.addFields(
							{ name: 'Level', value: level, inline: true },
							{ name: 'Kill/Death Ratio', value: kdr.toFixed(2), inline: true },
							{ name: 'Win/Loss Ratio', value: wlr.toFixed(2), inline: true },
							{ name: 'Kills', value: `${kills}`, inline: true },
							{ name: 'Deaths', value: `${deaths}`, inline: true },
							{ name: 'Revives', value: revives, inline: true },
							{ name: 'Wins', value: `${wins}`, inline: true },
							{ name: 'Losses', value: `${losses}`, inline: true },
							{ name: 'Time Played', value: `${timePlayed}H`, inline: true },
						);

					// send message
					msg.channel.send(data);
				}).catch(err => {
					console.error(err);
				});
			}).catch(err => {
				console.error(err);
			});
		}).catch(err => {
			console.error(err);
		});
	},
};
