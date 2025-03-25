const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js")

const responses = [
    "It is certain.",
    "Without a doubt.",
    "You may rely on it.",
    "Most likely.",
    "Cannot predict now.",
    "Don't count on it.",
    "My sources say no.",
    "Outlook not so good."
];

module.exports = {
    data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Get a random response")
    .addStringOption(option => 
        option.setName("question")
        .setDescription("The question you want to ask to the ball")
        .setRequired(true)
    ),

    async execute (interaction) {
        const question = interaction.options.getString("question");
        const embed = new EmbedBuilder()
        const answer = responses[Math.floor(Math.random() * responses.length)];
        embed.setColor("Purple")
        .setTitle("8ball")
        .addFields(
            { name: 'Question', value: question },
            { name: "Answer", value: answer }
        )

        await interaction.reply({ embeds: [embed] })
    }
}