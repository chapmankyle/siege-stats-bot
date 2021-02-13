<h1 align="center">Siege Stats Discord Bot</h1>

<p align="center">
  <img src="https://img.shields.io/github/license/chapmankyle/siege-stats-bot.svg?" alt="License: GPL-3.0"></img>
  <img src="https://img.shields.io/github/v/release/chapmankyle/siege-stats-bot.svg?" alt="Release"></img>
</p>

<p align="center">
  Discord bot to track statistics of players in Tom Clancy's Rainbow Six Siege :robot: :page_facing_up:
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/43512442/107859597-39695280-6e43-11eb-86f7-5008f2a18ae1.PNG" alt="Demo Screenshot"></img>
</p>

# Usage :cd:

To add the Discord bot into your server, you first need administrator priviledges for the server.
If you have administrator priviledges, you can simply navigate [here](https://discord.com/oauth2/authorize?client_id=805758708394098695&scope=bot) to add the bot :tada:

## :page_facing_up: Commands 
The bot only reads messages starting with `!ss`, followed by a valid command and any extra arguments.
The following are valid commands:
| Command                | Example                    | Description |
| :--------------------: | :------------------------- | :---------- |
| `help`                 | `!ss help`                 | Displays the currently available commands. |
| `general <playerName>` | `!ss general chappies.NZA` | Displays the general statistics for the given `playerName`. |
| `ranked <playerName>`  | `!ss ranked chappies.NZA`  | Displays the overall ranked statistics for the given `playerName`. |
| `casual <playerName>`  | `!ss casual chappies.NZA`  | Displays the overall casual statistics for the given `playerName`. |
| `seasonal <matchType> <playerName>` | `!ss seasonal ranked chappies.NZA` | Displays the current seasonal statistics of `matchType` for the given `playerName`. |

# Cloning :alien:

To build the project yourself, you need to type the following into your terminal:
```bash
# clone repository
git clone https://github.com/chapmankyle/siege-stats-bot.git

# navigate to repository
cd siege-stats-bot
```

An environment variable file, called `.env`, is needed in order to run the bot. The following variables need to be declared:
- `TOKEN` - Your discord authentication token.
- `UBI_AUTH` - Your email address and password, in the form `email:password`, encoded as a base64 string.

Now all you need to type is 
```bash
# run the bot locally
node index.js
```
and the Discord bot should be up and running! :tada:

# Contributing :partying_face:

Feel free to contribute to make this bot better! The steps to contribute are as follows:
1) [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) this repository
2) Make the relevant changes and/or add the features you would like
3) Submit a [pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
4) I will review the changes

Any contributions are greatly appreciated! :smile:
