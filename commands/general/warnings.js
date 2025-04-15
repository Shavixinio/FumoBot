const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('View the number of warnings for a user')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to check warnings for')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.client.sequelize) {
            await interaction.reply({ content: 'Database connection not available', flags: MessageFlags.Ephemeral });
            return;
        }

        const user = interaction.options.getUser('user');
        const server = interaction.guild;

        // Get warnings details
        try {
            const warnings = await interaction.client.sequelize.models.Warnings.findAll({
                where: {
                    userId: user.id,
                    guildId: server.id,
                },
                attributes: ['reason', 'createdAt']
            });

            if (warnings.length === 0) {
                await interaction.reply({ content: `${user} has no warnings in this server.`, flags: MessageFlags.Ephemeral });
                return;
            }

            const warningList = warnings.map((warning, index) => {
                const date = warning.createdAt.toLocaleDateString();
                return `${index + 1}. [${date}] ${warning.reason}`;
            }).join('\n');

            await interaction.reply({ 
                content: `${user} has **${warnings.length}** warnings in this server:\n\n${warningList}`, 
                flags: MessageFlags.Ephemeral 
            });
        } catch (error) {
            console.error('Error fetching warning count:', error);
            await interaction.reply({ content: 'An error occurred while fetching the warning count.', flags: MessageFlags.Ephemeral });
        }
    }
}