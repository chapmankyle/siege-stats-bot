// file      : commands/casual.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

const Discord = require('discord.js');
const axios = require('axios').default;

const convert = require('../convert.js');
const config = require('../config.json');

module.exports = {
	name: 'casual',
	description: 'Display casual information about a player.',
	execute(msg, args, ticket, sessionId) {
		// no player name given as argument
		if (args.length < 1) {
			msg.reply('you have not specified a player name. Try something like `!ss casual Beaulo.TSM`');
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
		axios.get(`https://api-ubiservices.ubi.com/v3/profiles?namesOnPlatform=${username}&platformType=uplay`, {
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

			const statTypes = 'casualpvp_kills,casualpvp_death,casualpvp_matchwon,casualpvp_matchlost,casualpvp_matchplayed,casualpvp_timeplayed';

			// get overall casual results
			const rankResp = await axios.get(`https://api-ubiservices.ubi.com/v1/spaces/${config.spaces.uplay}/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics?populations=${profileId}&statistics=${statTypes}`, {
				headers: authHeader,
			});

			// get seasonal rank
			const currRankResp = await axios.get(`https://api-ubiservices.ubi.com/v1/spaces/${config.spaces.uplay}/sandboxes/OSBOR_PC_LNCH_A/r6karma/players?board_id=pvp_casual&season_id=-1&region_id=ncsa&profile_ids=${profileId}`, {
				headers: authHeader,
			});

			const mmr = parseInt(currRankResp.data.players[`${profileId}`].mmr, 10);
			const rankId = convert.mmrToRank(mmr);
			const rankedImgURL = config.ranks[`${rankId}`].img;

			const rankedData = rankResp.data.results[`${profileId}`];

			const kills = 'casualpvp_kills:infinite' in rankedData ? parseInt(rankedData['casualpvp_kills:infinite'], 10) : 0;
			const deaths = 'casualpvp_death:infinite' in rankedData ? parseInt(rankedData['casualpvp_death:infinite'], 10) : 0;
			const kdr = deaths == 0 ? (kills * 1.0) : ((kills * 1.0) / (deaths * 1.0));

			const wins = 'casualpvp_matchwon:infinite' in rankedData ? parseInt(rankedData['casualpvp_matchwon:infinite'], 10) : 0;
			const losses = 'casualpvp_matchlost:infinite' in rankedData ? parseInt(rankedData['casualpvp_matchlost:infinite'], 10) : 0;
			const wlr = losses == 0 ? (wins * 1.0) : ((wins * 1.0) / (losses * 1.0));

			const numMatches = 'casualpvp_matchplayed:infinite' in rankedData ? parseInt(rankedData['casualpvp_matchplayed:infinite'], 10) : 0;
			const abandons = numMatches - (wins + losses);

			const rawTimePlayed = 'casualpvp_timeplayed:infinite' in rankedData ? parseFloat(rankedData['casualpvp_timeplayed:infinite']) : 0;
			const timePlayedHours = Math.floor(rawTimePlayed / 3600.0);
			const timePlayedMins = Math.round(((rawTimePlayed / 3600) % timePlayedHours) * 60);

			const kpmatch = numMatches == 0 ? 0 : (kills * 1.0) / (numMatches * 1.0);
			const kpmin = rawTimePlayed == 0 ? 0 : ((kills * 1.0) / rawTimePlayed) * 60.0;

			const data = new Discord.MessageEmbed()
				.setColor('#ee00ff')
				.setAuthor(profileName, `https://ubisoft-avatars.akamaized.net/${profileId}/default_146_146.png?appId=${config.appId}`)
				.setTitle (`View ${profileName} stats`)
				.setDescription(`Overall casual statistics.\nUplay ID: ${profileId}`)
				.setURL(`https://r6stats.com/stats/${profileId}`)
				.setDescription(`Overall casual statistics.\nUplay ID: ${profileId}`)
				.setThumbnail(rankedImgURL)
				.addFields(
					{ name: 'Kills', value: `${kills}`, inline: true },
					{ name: 'Deaths', value: `${deaths}`, inline: true },
					{ name: 'Kill/Death Ratio', value: `${kdr == 0 ? 0 : kdr.toFixed(3)}`, inline: true },
					{ name: 'Wins', value: `${wins}`, inline: true },
					{ name: 'Losses', value: `${losses}`, inline: true },
					{ name: 'Win/Loss Ratio', value: `${wlr == 0 ? 0 : wlr.toFixed(3)}`, inline: true },
					{ name: 'Matches', value: `${numMatches}`, inline: true },
					{ name: 'Abandons', value: `${abandons}`, inline: true },
					{ name: 'Time Played', value: `${timePlayedHours} H ${timePlayedMins} M`, inline: true },
					{ name: 'Kills/Match', value: `${kpmatch == 0 ? 0 : kpmatch.toFixed(2)}`, inline: true },
					{ name: 'Kills/Minute', value: `${kpmin == 0 ? 0 : kpmin.toFixed(2)}`, inline: true },
				);

			// send message
			msg.channel.send(data);
		}).catch(err => {
			console.error(err);
		});
	},
};
