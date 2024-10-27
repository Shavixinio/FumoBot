const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

// Get all commands from the commands folder
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Loop over all the files in the commands folder and add them to the commands array
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Create a new REST instance
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

// Refresh the commands
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        // Put the commands in the guild
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        // Catch any errors and log them to the console
        console.error(error);
    }
})();