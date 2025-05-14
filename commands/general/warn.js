const { Client, SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const Sequelize = require('sequelize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to warn')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('The reason for the warning')
                .setRequired(false)
        ),
    async execute(interaction) {
        if (!interaction.client.sequelize) {
            await interaction.reply({ content: 'Database connection not available', flags: MessageFlags.Ephemeral });
            return;
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const server = interaction.guild;

        // Get total warnings count
        try {
            const warningCount = await interaction.client.sequelize.models.Warnings.count({
                where: {
                    userId: user.id,
                    guildId: server.id
                }
            });

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Warning')
                .setDescription(`You have been warned in ${server} for: **${reason}**.\nTotal warnings: **${warningCount + 1}**`)
                .setTimestamp();

            await interaction.reply({ content: `Warned ${user} for: **${reason}**`, flags: MessageFlags.Ephemeral });
            user.send({ embeds: [embed] }).catch(err => {
                console.error(`Could not send warning DM to ${user.tag}:`, err);
                interaction.followUp({ content: `Could not send DM to ${user}. They may have DMs disabled.`, Flags: MessageFlags.Ephemeral });
            });

            // Log the warning to the database
            try {
                await interaction.client.sequelize.models.Warnings.create({
                    userId: user.id,
                    guildId: server.id,
                    moderatorId: interaction.user.id,
                    reason: reason,
                    timestamp: new Date()
                });
            } catch (error) {
                console.error('Error logging warning:', error);
                await interaction.followUp({ content: 'Warning was issued but failed to log to database.', Flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            console.error('Error accessing database:', error);
            await interaction.reply({ content: 'An error occurred while accessing the database', flags: MessageFlags.Ephemeral });
            return;
        }
    }
}
