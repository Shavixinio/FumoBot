const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require('discord.js');

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
        // Get the user ID from the command options
        const userId = interaction.options.getString('userid');

        if (userId == Client.user) {
            return interaction.reply({
                content: "I can't unban myself",
                Flags: MessageFlags.ephemeral
            })
        }

        // Check if the member executing the command has the necessary permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ 
                content: 'You need the "Ban Members" permission to use this command.', 
                Flags: MessageFlags.Ephemeral
            });
        }
        
        if (user.id == botId) {
            return interaction.reply({
                content: 'I cannot kick myself!',
                Flags: MessageFlags.Ephemeral
            })
        }

        try {
            // Fetch the ban to ensure the user is banned
            const banInfo = await interaction.guild.bans.fetch(userId);

            if (!banInfo) {
                return interaction.reply({ 
                    content: `❌ No banned user found with the ID ${userId}.`, 
                    Flags: MessageFlags.Ephemeral
                });
            }

            // Unban the user
            await interaction.guild.bans.remove(userId);
            await interaction.reply({ 
                content: `✅ Successfully unbanned the user with ID ${userId}.` 
            });
        } catch (error) {
            console.error(error);
            // Handle errors (e.g., user ID not found, bot lacks permissions, etc.)
            await interaction.reply({ 
                content: '❌ Failed to unban the user. Please ensure the ID is correct and I have the required permissions.', 
                Flags: MessageFlags.Ephemeral
            });
        }
    },
};
