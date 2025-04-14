const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const { Client, Collection, Events, GatewayIntentBits, PresenceUpdateStatus, ActivityType, MessageFlags } = require('discord.js');
require('dotenv').config()
const token = process.env.TOKEN

// Discord bots require the use of intents to access certain events.
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent

// This ensures that the bot is only able to mention specific users,
// so someone can't make the bot somehow ping everyone on the server at once.
	], allowedMentions: { parse: ['users'] } });

	// Sequelize is an ORM for Node.js that supports many SQL dialects.
	// It allows you to interact with your database using JavaScript objects instead of raw SQL queries.
	// In this case, we're using SQLite as our database.
	const sequelize = new Sequelize('database', 'user', 'password', {
		host: 'localhost',
		dialect: 'sqlite',
		logging: false,
		// SQLite only
		storage: 'database.sqlite',
	});

	const Tags = sequelize.define('tags', {
		name: {
			type: Sequelize.STRING,
			unique: true,
		},
		description: Sequelize.TEXT,
		username: Sequelize.STRING,
		usage_count: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	});
	
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	Tags.sync();
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	client.user.setStatus(PresenceUpdateStatus.Online)
	// client.user.setActivity(`Hello`, { type: ActivityType.Custom })
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', Flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', Flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(token);