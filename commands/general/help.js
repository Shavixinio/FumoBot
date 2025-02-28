const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),
        async execute (interaction) {
            const embed = new EmbedBuilder()
            .setTitle("Commands")
            .setDescription(`
                **Moderation**:
                ban - bans a person
                kick - kicks a person
                unban - unbans a person
                `)
                .setColor("237feb");
            await interaction.reply({content: embed, ephermal: true});
        }
}