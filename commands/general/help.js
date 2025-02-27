const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),
        // TODO: Make an embed that list all commands
        async execute (interaction) {
            await interaction.reply({content: "test", ephermal: true});
        }
}