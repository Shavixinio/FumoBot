const { Client, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config(); // Load environment variables from .env file
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const fs = require('fs');
const path = require('path');

// Create a new client instance with the specified intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands from the commands directory
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Set up commands by reading each command file and adding it to the client.commands collection
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

// Create a new REST instance for registering commands
const rest = new REST({ version: '9' }).setToken(token);

// Register commands with the Discord API
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        // Log any errors to the console
        console.error(error);
    }
})();

// Turn on the bot when the client is ready. The bot will appear online.
client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

// Handle interaction events
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return; // Ignore non-command interactions

    // Get the command from the client.commands collection
    const command = client.commands.get(interaction.commandName);

    // If the command doesn't exist, exit early
    if (!command) return;

    try {
        // Execute the command
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        // Reply with an error message if the command execution fails
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Log in with your bot's token
client.login(token);