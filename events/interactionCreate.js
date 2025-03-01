const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		const command = interaction.client.commands.get(interaction.commandName);

		// If someone forgets to reload the commands after deleting one, the bot will display an error message.
		// Usually you're supposed to run "npm run" when you want to start everything up,
		// but an option to "node ." to avoid making too many API calls is also an option
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				// Ephermal messages are only visible to the user who executed the command
				// This is useful for error messages that are only relevant to the user who executed the command
				// If you want everyone to see the message, you can remove the flags property, but why would you do that?
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};