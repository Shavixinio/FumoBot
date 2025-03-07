const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

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
                .setDescription('The reason for banning the member')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Get the user to ban
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || "No reason provided";

        // Check if the member executing the command has the necessary permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ 
                content: 'You need the "Ban Members" permission to use this command.', 
                flags: MessageFlags.Ephemeral 
            });
        }

        // Prevent banning oneself
        if (interaction.member.id === user.id) {
            return interaction.reply({ 
                content: 'You cannot ban yourself!', 
                flags: MessageFlags.Ephemerallags.Ephemeral 
            });
        }

        try {
            // Attempt to ban the user
            await member.ban(reason);
            // Confirm the ban to the command executor
            await interaction.reply({
                content: `✅ Successfully banned ${user.tag}. Reason: ${reason}`
            });
        } catch (error) {
            // Handle any errors during the banning process
            console.error(error);
            await interaction.reply({ 
                content: '❌ Failed to ban the user. Please check my permissions or ensure the user is still in the server.', 
                flags: MessageFlags.Ephemerallags.Ephemeral 
            });
        }
    },
};
