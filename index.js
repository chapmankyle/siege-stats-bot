// file      : index.js
// copyright : Copyright (c) 2020-present, Kyle Chapman
// license   : GPL-3.0; see accompanying LICENSE file

// invite link : https://discord.com/oauth2/authorize?client_id=805758708394098695&scope=bot

const dotenv = require('dotenv');
const config = require('./config.json');

const Discord = require('discord.js');

// configure for .env file reading
dotenv.config();

// store token from environment file
const token = process.env.TOKEN;

// only read messages starting with `validPrefix`
const validPrefix = config.prefix + config.name;

const client = new Discord.Client();

// trigger when application is ready
client.once('ready', () => {
	console.log('Ready!');
});

// upon receiving a message
client.on('message', message => {
	const content = message.content;

	// ignore messages that do not start with prefix and name
	if (!content.startsWith(validPrefix) || message.author.bot) {
		return;
	}

	// get additional arguments
	const args = content.slice(validPrefix.length).trim().toLowerCase().split(/ +/);
	console.log(args);
});

// login with token from environment file
client.login(token);
