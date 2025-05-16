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
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers) && 
            !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const permissionEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permission Denied')
                .setDescription('You need either "Kick Members" or "Ban Members" permission to warn users.')
                .setTimestamp();
            return interaction.reply({ embeds: [permissionEmbed], flags: MessageFlags.Ephemeral });
        }

        if (!interaction.client.sequelize) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Database Error')
                .setDescription('Database connection not available')
                .setTimestamp();
            await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
            return;
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const server = interaction.guild;


        if (interaction.member.id === user.id) {
            const selfEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚠️ Invalid Action')
                .setDescription('You cannot warn yourself!')
                .setTimestamp();
            await interaction.reply({ embeds: [selfEmbed], flags: MessageFlags.Ephemeral });
            return;
        }

        if (user.bot) {
            const botEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚠️ Invalid Target')
                .setDescription('You cannot warn bots!')
                .setTimestamp();
            await interaction.reply({ embeds: [botEmbed], flags: MessageFlags.Ephemeral });
            return;
        }

        try {
            const warningCount = await interaction.client.sequelize.models.Warnings.count({
                where: {
                    userId: user.id,
                    guildId: server.id
                }
            });

            const warnEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('⚠️ Warning Issued')
                .addFields(
                    { name: 'Warned User', value: `${user.tag}`, inline: true },
                    { name: 'Warned By', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Total Warnings', value: `${warningCount + 1}`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            const dmEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('⚠️ Warning Received')
                .setDescription(`You have been warned in ${server.name}`)
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Total Warnings', value: `${warningCount + 1}` }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [warnEmbed] });
            
            try {
                await user.send({ embeds: [dmEmbed] });
            } catch (err) {
                const dmErrorEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('⚠️ DM Not Sent')
                    .setDescription(`Could not send DM to ${user}. They may have DMs disabled.`)
                    .setTimestamp();
                await interaction.followUp({ embeds: [dmErrorEmbed], flags: MessageFlags.Ephemeral });
            }

            try {
                await interaction.client.sequelize.models.Warnings.create({
                    userId: user.id,
                    guildId: server.id,
                    moderatorId: interaction.user.id,
                    reason: reason,
                    timestamp: new Date()
                });
            } catch (error) {
                const dbErrorEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('⚠️ Database Error')
                    .setDescription('Warning was issued but failed to log to database.')
                    .setTimestamp();
                await interaction.followUp({ embeds: [dbErrorEmbed], flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Error')
                .setDescription('An error occurred while accessing the database')
                .setTimestamp();
            await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    }
};
