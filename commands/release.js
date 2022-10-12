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
        .setName("repo")
        .setDescription("The name of the repository")
        .setRequired(true)
    ),

  async execute(interaction) {
    const owner = interaction.options.getString("owner");
    const repo = interaction.options.getString("repo");

    const release = await getLatestRelease(owner, repo);

    // If the release is null, it means that the repository doesn't have any releases
    if (!release) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription(
          `Could not find a release for ${owner}/${repo} on GitHub.`
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
      .addFields(
        { name: "Author", value: release.author.login, inline: true },
        { name: "Published at", value: new Date(release.published_at).toLocaleDateString() + " " + new Date(release.published_at).toLocaleTimeString(), inline: true },
      )
      .setURL(release.html_url)
      .setTimestamp(new Date());

    await interaction.reply({ embeds: [embed] });
  },
};
