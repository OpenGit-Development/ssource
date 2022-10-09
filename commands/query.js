const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getRepositories } = require("../api/octokit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("repo-search")
    .setDescription(
      "Get a repository based on certain parameters ie. language, query"
    )
    .addStringOption((option) =>
      option
        .setName("Name")
        .setDescription(
          "The title of the repository you want to get (e.g. convolutional neural network)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("Language")
        .setDescription(
          "The language that the repository is composed of (e.g. Python, JavaScript etc.)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("number")
        .setDescription(
          "The number of repositories you want to get (e.g. 3, 5)"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.get("Name").value;
    const lang = interaction.options.get("Language").value;
    const number = interaction.options.get("number").value;
    const repo = await getRepositories(text, lang, number);

    // If the value is null, no existing repository matches the query given
    if (!repo) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#CC5500")
        .setTitle("Dang it, try again")
        .setDescription(
          "Your values did not match the ones of any existing repository."
        );
      await interaction.reply({ embeds: [errorEmbed] });
    }

    const embed = new EmbedBuilder()
      .setColor("#AFE1AF")
      .setTitle(`${repo.full_name}`)
      .setDescription(`${repo.description}`)
      .setURL(`${repo.html_url}`);

    await interaction.reply({ embeds: [embed] });
  },
};
