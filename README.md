# FumoBot
A Discord bot that helps with moderation through slash commands that are built-in the bot.

# Installation
### Requirements
- Have a [Discord](https://discord.com/) account
- [Node.js](https://nodejs.org/en) (v20.18.0+)
- An IDE ([VSCode](https://code.visualstudio.com/) is recommended)
- [git](https://git-scm.com/)

### Actually setting up the bot
1. Make a bot at the [Discord developer portal](https://discord.dev) and make sure to toggle the `presence`, `server members` and `message content` intents
2. Invite your bot to any server [here](https://discordapi.com/permissions.html#0) (You must have the Manage Server permission to invite bots)
3. Open your Terminal
```bash
git clone https://github.com/Shavixinio/FumoCore.git
cd FumoCore
npm install
```
4. Get your bot's token and paste it into the `.envexample` (Make sure to actually rename the file to `.env`)
> [!CAUTION]
> **Do not** share your bot's token with anyone as it allows a bad actor to gain full access to your bot

5. To run your bot, type the following command into the terminal:
```bash
npm start
```