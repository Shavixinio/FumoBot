const { SlashCommandBuilder, PermissionsBitField, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The member to kick')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking the member')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Check for required permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permission Denied')
                .setDescription('You need the "Kick Members" permission to use this command.')
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (user.id === interaction.client.user.id) {
            const selfEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚠️ Invalid Action')
                .setDescription('I cannot kick myself!')
                .setTimestamp();
            return interaction.reply({ embeds: [selfEmbed], flags: MessageFlags.Ephemeral });
        }

        if (interaction.member.id === user.id) {
            const warnEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚠️ Invalid Action')
                .setDescription('You cannot kick yourself!')
                .setTimestamp();
            return interaction.reply({ embeds: [warnEmbed], flags: MessageFlags.Ephemeral });
        }

        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            const notFoundEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ User Not Found')
                .setDescription('The specified user is not a member of this server.')
                .setTimestamp();
            return interaction.reply({ embeds: [notFoundEmbed], flags: MessageFlags.Ephemeral });
        }

        try {
            await member.kick(reason);
            
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ User Kicked')
                .addFields(
                    { name: 'Kicked User', value: `${user.tag}`, inline: true },
                    { name: 'Kicked By', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Kick Failed')
                .setDescription('Failed to kick the member. Please ensure I have the necessary permissions and the user is not a higher rank.')
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    },
};
