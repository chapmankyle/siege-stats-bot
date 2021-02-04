// file      : commands/general.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

const Discord = require('discord.js');
const axios = require('axios').default;

const config = require('../config.json');

module.exports = {
	name: 'general',
	description: 'Display general information about a player.',
	execute(msg, args, ticket, sessionId) {
		// no player name given as argument
		if (args.length < 1) {
			msg.reply('you have not specified a player name. Try something like `!ss general Beaulo.TSM`');
			return;
		}

		const username = args[0];

		// header to use after authorization completes
		const authHeader = {
			'Authorization': 'Ubi_v1 t=' + ticket,
			'Ubi-AppId': config.appId,
			'Ubi-SessionId': sessionId,
		};

		// get matching profiles
		axios.get(`https://public-ubiservices.ubi.com/v3/profiles?namesOnPlatform=${username}&platformType=uplay`, {
			headers: authHeader,
		}).then(async profilesResp => {
			const matches = profilesResp.data.profiles;

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

			// only search for these statistics
			const statNames = 'ProgressionClearanceLevel,ProgressionPvPKills,ProgressionPvPDeath,ProgressionPvPMatchesWon,ProgressionPvPMatchesLost,ProgressionPvPRevive,ProgressionPvPTimePlayed';

			const statsResp = await axios.get(`https://public-ubiservices.ubi.com/v1/profiles/stats?profileIds=${profileId}&spaceId=${config.spaces.uplay}&statNames=${statNames}`, {
				headers: authHeader,
			});

			// no statistics found for player
			if (!('data' in statsResp)) {
				console.error('Error occurred fetching statistics.');
				return;
			}

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

			const rankResp = await axios.get(`https://public-ubiservices.ubi.com/v1/spaces/${config.spaces.uplay}/sandboxes/OSBOR_PC_LNCH_A/r6karma/players?board_id=pvp_ranked&season_id=-1&region_id=ncsa&profile_ids=${profileId}`, {
				headers: authHeader,
			});

			const rankedData = rankResp.data.players[`${profileId}`];
			const rank = rankedData.rank;
			const rankedImgURL = config.ranks[rank].img;

			// add message data
			const data = new Discord.MessageEmbed()
				.setColor('#ff6a00')
				.setAuthor(profileName, `https://ubisoft-avatars.akamaized.net/${profileId}/default_146_146.png?appId=${config.appId}`)
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
					{ name: 'Time Played', value: `${timePlayed} H`, inline: true },
				);

			// send message
			msg.channel.send(data);
		}).catch(err => {
			console.error(err);
		});
	},
};
