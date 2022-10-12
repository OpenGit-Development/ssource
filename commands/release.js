const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getLatestRelease } = require("../api/octokit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("release")
    .setDescription("Get the latest release of a repository on GitHub")
    .addStringOption((option) =>
      option
        .setName("repository")
        .setDescription(
          "The repository to get the latest release of (e.g. cytronicoder/ssource)"
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    const repository = interaction.options.getString("repository");
    // split the repository into owner and name
    const [owner, name] = repository.split("/");

    if (!owner || !name) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription(
          `Invalid repository: ${repository}. Please use the format owner/repository.`
        );

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    const release = await getLatestRelease(owner, name);

    // If the release is null, it means that the repository doesn't have any releases
    if (!release) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription(
          `Could not find a release for ${owner}/${name} on GitHub.`
        );

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    if (release === "rate limit exceeded") {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Rate limit exceeded.");

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
