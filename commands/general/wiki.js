const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wiki = require('wikipedia');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Search for information')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('What you want to search for')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const searchQuery = interaction.options.getString('query');
        
        try {
            const searchResults = await wiki.search(searchQuery);
            const page = await wiki.page(searchResults.results[0].title);
            const summary = await page.summary();
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(summary.title)
                .setDescription(summary.extract)
                .setURL(summary.content_urls.desktop.page);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('Could\'t find any information on that topic');
        }
    }
};