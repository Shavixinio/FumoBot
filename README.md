# DiscordBotProject
Discord bot that helps with moderation through slash commands that are built-in the bot.

ver. 0.0.2 Beta

# Installation
### Requirements
- Have a [Discord](https://discord.com/) account
- Have [Node.js](https://nodejs.org/en) installed (v20.18.0+)
- An IDE ([VSCode](https://code.visualstudio.com/) is recommended)

### Actually setting up the bot
1. Make a bot at the [Discord developer portal](https://discord.dev) and make sure to toggle the `presence`, `server members` and `message content` intents
2. Invite your bot to any server [here](https://discordapi.com/permissions.html#0) (You must have the Manage Server permission to invite bots)
3. Open your Terminal
```console
cd (Your folder for the repository)
```
```console
git pull https://github.com/Shavixinio/DiscordBotProject.git
```
```console
npm init # Follow the process
```

```console
npm i discord.js
```
```console
npm i dotenv
```
4. Get your bot's token and paste it into the `.envexample` (Make sure to actually rename the file to `.env`)
> [!CAUTION]
> **Do not** share your bot's token with anyone as it allows a bad actor to gain full access to your bot

5. To run your bot, type the following command into the terminal:
```console
npm start
```
# Changes
- Added dotenv file example
- Added installation guide above
- Added command handling
- Added a ping command
