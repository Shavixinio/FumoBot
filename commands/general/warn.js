const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
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
        // Check for required permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers) && 
            !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ 
                content: 'You need either "Kick Members" or "Ban Members" permission to warn users.', 
                flags: MessageFlags.Ephemeral 
            });
        }

        if (!interaction.client.sequelize) {
            await interaction.reply({ content: 'Database connection not available', flags: MessageFlags.Ephemeral });
            return;
        }

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const server = interaction.guild;

        // Check if trying to warn a bot
        if (user.bot) {
            await interaction.reply({ content: "You can't warn bots!", flags: MessageFlags.Ephemeral });
            return;
        }

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
            
            // Try to send DM to user
            try {
                await user.send({ embeds: [embed] });
            } catch (err) {
                console.error(`Could not send warning DM to ${user.tag}:`, err);
                await interaction.followUp({ 
                    content: `Could not send DM to ${user}. They may have DMs disabled.`, 
                    flags: MessageFlags.Ephemeral 
                });
            }

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
                await interaction.followUp({ 
                    content: 'Warning was issued but failed to log to database.', 
                    flags: MessageFlags.Ephemeral 
                });
            }
        } catch (error) {
            console.error('Error accessing database:', error);
            await interaction.reply({ 
                content: 'An error occurred while accessing the database', 
                flags: MessageFlags.Ephemeral 
            });
        }
    }
};
