const { SlashCommandBuilder, PermissionsBitField, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server.')
        .addStringOption(option => 
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true)
        ),
    async execute(interaction) {
        const userId = interaction.options.getString('userid');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permission Denied')
                .setDescription('You need the "Ban Members" permission to use this command.')
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }

        if (userId === interaction.client.user.id) {
            const selfEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚠️ Invalid Action')
                .setDescription('I cannot unban myself!')
                .setTimestamp();
            return interaction.reply({ embeds: [selfEmbed], flags: MessageFlags.Ephemeral });
        }

        if (userId === interaction.user.id) {
            const warnEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚠️ Invalid Action')
                .setDescription('You cannot unban yourself!')
                .setTimestamp();
            return interaction.reply({ embeds: [warnEmbed], flags: MessageFlags.Ephemeral });
        }

        try {
            const banInfo = await interaction.guild.bans.fetch(userId);

            if (!banInfo) {
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ User Not Found')
                    .setDescription(`No banned user found with the ID ${userId}.`)
                    .setTimestamp();
                return interaction.reply({ embeds: [notFoundEmbed], flags: MessageFlags.Ephemeral });
            }

            await interaction.guild.bans.remove(userId);
            
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ User Unbanned')
                .addFields(
                    { name: 'Unbanned User', value: `${banInfo.user.tag}`, inline: true },
                    { name: 'Unbanned By', value: `${interaction.user.tag}`, inline: true },
                    { name: 'User ID', value: userId }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Unban Failed')
                .setDescription('Failed to unban the user. Please ensure the ID is correct and I have the required permissions.')
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    },
};
