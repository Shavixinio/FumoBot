# FumoBot
A general purpose Discord bot

# Abandoned (for now)
This project at first was partially for my school assignment and a hobby project, but I've decided to move onto other things/languages. If I will ever consider taking bot development seriously, then I might consider working on the bot again

# Installation
### Requirements
- Have a [Discord](https://discord.com/) account
- [Node.js](https://nodejs.org/en) (v20.18.0+)
- An IDE ([VSCode](https://code.visualstudio.com/) is recommended)
- [git](https://git-scm.com/)

### Actually setting up the bot
1. Make a bot at the [Discord developer portal](https://discord.dev) and make sure to toggle the `presence`, `server members` and `message content` intents
2. Set up an invite for your bot [here](https://discordapi.com/permissions.html#0) (You must be the owner or have the Manage Server permission to invite bots)
3. Open your Terminal
```bash
git clone https://github.com/Shavixinio/FumoBot.git
cd FumoBot
npm install
```
4. Get your bot's token and paste it into the `.envexample` (Make sure to actually rename the file to `.env`)
> [!CAUTION]
> **Do not** share your bot's token with anyone as it allows a bad actor to gain full access to your bot

5. To run your bot, type the following command into the terminal:
```bash
npm start
```
