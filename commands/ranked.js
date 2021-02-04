// file      : commands/ranked.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

const Discord = require('discord.js');
const axios = require('axios').default;

const config = require('../config.json');

module.exports = {
	name: 'ranked',
	description: 'Display ranked information about a player.',
	execute(msg, args, ticket, sessionId) {
		// no player name given as argument
		if (args.length < 1) {
			msg.reply('you have not specified a player name. Try something like `!ss ranked Beaulo.TSM`');
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

			// get latest season ranked results
			const rankResp = await axios.get(`https://public-ubiservices.ubi.com/v1/spaces/${config.spaces.uplay}/sandboxes/OSBOR_PC_LNCH_A/r6karma/players?board_id=pvp_ranked&season_id=-1&region_id=ncsa&profile_ids=${profileId}`, {
				headers: authHeader,
			});

			const rankedData = rankResp.data.players[`${profileId}`];
			const rankId = rankedData.rank;
			const rankedImgURL = config.ranks[rankId].img;

			const season = config.seasons[rankedData.season];
			const maxMMR = parseInt(rankedData['max_mmr'], 10);
			const wins = parseInt(rankedData.wins, 10);
			const losses = parseInt(rankedData.losses, 10);
			const wlr = losses == 0 ? (wins * 1.0) : ((wins * 1.0) / (losses * 1.0));
			const numMatches = wins + losses;

			const mmr = parseInt(rankedData.mmr, 10);
			const mmrChange = parseInt(rankedData['last_match_mmr_change'], 10);
			const mmrChangeVal = mmrChange > 0 ? `+${mmrChange}` : `${mmrChange}`;
			const rankName = config.ranks[rankId].name;

			const kills = parseInt(rankedData.kills, 10);
			const deaths = parseInt(rankedData.deaths, 10);
			const kdr = deaths == 0 ? (kills * 1.0) : ((kills * 1.0) / (deaths * 1.0));

			const mean = parseFloat(rankedData['skill_mean']);
			const stdev = parseFloat(rankedData['skill_stdev']);
			const abandons = parseInt(rankedData.abandons);

			// add message data
			const data = new Discord.MessageEmbed()
				.setColor('#00a2ff')
				.setAuthor(profileName, `https://ubisoft-avatars.akamaized.net/${profileId}/default_146_146.png?appId=${config.appId}`)
				.setDescription('Ranked stats for the current season.')
				.setThumbnail(rankedImgURL)
				.addFields(
					{ name: 'Season', value: season, inline: true },
					{ name: 'Max MMR', value: `${maxMMR}`, inline: true },
					{ name: 'Matches', value: `${numMatches}`, inline: true },
					{ name: 'Current MMR', value: `${mmr}`, inline: true },
					{ name: 'MMR Change', value: `${mmrChangeVal}`, inline: true },
					{ name: 'Rank', value: rankName, inline: true },
					{ name: 'Kills', value: `${kills}`, inline: true },
					{ name: 'Deaths', value: `${deaths}`, inline: true },
					{ name: 'Kill/Death Ratio', value: kdr.toFixed(2), inline: true },
					{ name: 'Wins', value: `${wins}`, inline: true },
					{ name: 'Losses', value: `${losses}`, inline: true },
					{ name: 'Win/Loss Ratio', value: wlr.toFixed(2), inline: true },
					{ name: 'Skill Mean', value: mean.toFixed(2), inline: true },
					{ name: 'Skill Deviation', value: stdev.toFixed(2), inline: true },
					{ name: 'Abandons', value: `${abandons}`, inline: true },
				);

			// send message
			msg.channel.send(data);
		}).catch(err => {
			console.error(err);
		});
	},
};
