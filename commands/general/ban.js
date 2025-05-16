const { SlashCommandBuilder, PermissionsBitField, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('Reason for the ban')
            .setRequired(false)
    ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || "No reason provided";

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permission Denied')
                .setDescription('You need the "Ban Members" permission to use this command.')
                .setTimestamp();
            
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }

        if (interaction.member.id === user.id) {
            const warnEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚠️ Invalid Action')
                .setDescription('You cannot ban yourself!')
                .setTimestamp();
            
            return interaction.reply({ embeds: [warnEmbed], flags: MessageFlags.Ephemeral });
        }

        try {
            await interaction.guild.members.ban(user, { reason: reason });
            
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ User Banned')
                .addFields(
                    { name: 'Banned User', value: `${user.tag}`, inline: true },
                    { name: 'Banned By', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed] });
            
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Ban Failed')
                .setDescription('Failed to ban the user. Please check my permissions or ensure the user is still in the server.')
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    },
};
