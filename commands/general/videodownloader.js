const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tiktok")
    .setDescription("Download a TikTok video (no watermark)")
    .addStringOption(option =>
      option.setName("url")
        .setDescription("The TikTok video URL")
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName("ephemeral")
        .setDescription("Make the message show only to you?")
    ),

  async execute(interaction) {
    const url = interaction.options.getString("url");
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    if (!url.includes("tiktok.com")) {
      return interaction.reply({
        content: "Please provide a valid TikTok URL.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply({ ephemeral });

    try {
      const res = await axios.get("https://tikwm.com/api/", {
        params: { url },
      });

      const data = res.data;

      if (!data || !data.data || !data.data.play) {
        return interaction.editReply(
          "Couldn't retrieve the video. It might be private or unavailable."
        );
      }

      const downloadLink = data.data.play;

      await interaction.editReply(`Here's your video \n[click here to download](${downloadLink})`);
    } catch (err) {
      console.error(err);
      await interaction.editReply(
        "There was an error fetching the TikTok video."
      );
    }
  },
};
