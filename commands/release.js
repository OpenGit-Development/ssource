const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getLatestRelease } = require("../api/octokit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("release")
    .setDescription("Get the latest release of a repository on GitHub")
    .addStringOption((option) =>
      option
        .setName("owner")
        .setDescription("The owner of the repository")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("repository")
        .setDescription("The repository to get the latest release of")
        .setRequired(true)
    ),

  async execute(interaction) {
    const owner = interaction.options.getString("owner");
    const repository = interaction.options.getString("repository");

    const release = await getLatestRelease(owner, repository);

    // If the release is null, it means that the repository doesn't have any releases
    if (!release) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription(
          `Could not find a release for ${owner}/${repository} on GitHub. Make sure the repository exists and has at least one release.`
        );

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    // Create the embed
    const embed = new EmbedBuilder()
      .setColor("#171515")
      .setTitle(release.tag_name)
      .setDescription(release.body)
      .setURL(release.html_url);

    await interaction.reply({ embeds: [embed] });
  },
};
