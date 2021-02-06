// file      : convert.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

module.exports = {
	name: 'convert',
	description: 'Available conversion methods.',
	mmrToRank(mmr) {
		if (mmr == 0) {
			return 0; // unranked
		}
		else if (mmr > 4999) {
			return 23; // champion
		}
		else if (mmr > 4399) {
			return 22; // diamond
		}
		else if (mmr > 3999) {
			return 21; // platinum 1
		}
		else if (mmr > 3599) {
			return 20; // platinum 2
		}
		else if (mmr > 3199) {
			return 19; // platinum 3
		}
		else if (mmr > 2999) {
			return 18; // gold 1
		}
		else if (mmr > 2799) {
			return 17; // gold 2
		}
		else if (mmr > 2599) {
			return 16; // gold 3
		}
		else if (mmr > 2499) {
			return 15; // silver 1
		}
		else if (mmr > 2399) {
			return 14; // silver 2
		}
		else if (mmr > 2299) {
			return 13; // silver 3
		}
		else if (mmr > 2199) {
			return 12; // silver 4
		}
		else if (mmr > 2099) {
			return 11; // silver 5
		}
		else if (mmr > 1999) {
			return 10; // bronze 1
		}
		else if (mmr > 1899) {
			return 9; // bronze 2
		}
		else if (mmr > 1799) {
			return 8; // bronze 3
		}
		else if (mmr > 1699) {
			return 7; // bronze 4
		}
		else if (mmr > 1599) {
			return 6; // bronze 5
		}
		else if (mmr > 1499) {
			return 5; // copper 1
		}
		else if (mmr > 1399) {
			return 4; // copper 2
		}
		else if (mmr > 1299) {
			return 3; // copper 3
		}
		else if (mmr > 1199) {
			return 2; // copper 4
		}
		else {
			return 1; // copper 5
		}
	},
};
