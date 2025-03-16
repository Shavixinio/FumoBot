const {
  SlashCommandBuilder,
  PermissionsBitField,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The member to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for kicking the member")
        .setRequired(false)
    ),
  async execute(interaction) {
    // Get the user to kick and the reason (if provided)
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    interaction.options.getString("reason") || "No reason provided";
    if (user.id == Client.user) {
      return interaction.reply({
        content: "I cannot kick myself!",
        flags: MessageFlags.Ephemeral,
      });
    }

    // Ensure the member executing the command has the "Kick Members" permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({
        content: 'You need the "Kick Members" permission to use this command.',
        flags: MessageFlags.Ephemeral,
      });
    }

    // Prevent self-kick
    if (interaction.member.id === user.id) {
      return interaction.reply({
        content: "You cannot kick yourself!",
        flags: MessageFlags.Ephemeral,
      });
    }

    // Find the member in the guild
    const member = interaction.guild.members.cache.get(user.id);

    // Check if the user is a valid member of the server
    if (!member) {
      return interaction.reply({
        content: "The specified user is not a member of this server.",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      // Attempt to kick the member
      await member.kick(reason);
      await interaction.reply({
        content: `✅ Successfully kicked ${user.tag}. Reason: ${reason}`,
      });
    } catch (error) {
      console.error(error);
      // Handle errors (e.g., missing permissions)
      await interaction.reply({
        content:
          "❌ Failed to kick the member. Please ensure I have the necessary permissions and the user is not a higher rank.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
