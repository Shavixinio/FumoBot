const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong! and measures latency.'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.editReply(`Pong! Latency is ${sent.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms.`);
    },
};