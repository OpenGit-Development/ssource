const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getRepositoryInfo, getLatestRelease } = require("../api/octokit");

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
    await interaction.deferReply();
    const owner = interaction.options.getString("owner");
    const repository = interaction.options.getString("repository");

    const info = await getRepositoryInfo(owner, repository);
    const release = await getLatestRelease(owner, repository);

    // console.log(info);

    const embed = new EmbedBuilder()
      .setColor("#171515")
      .setTitle(release.tag_name)
      .setDescription(release.body)
      .setURL(release.html_url)

      .setThumbnail(info.owner.avatar_url);

    await interaction.editReply({ embeds: [embed] });
  },
};
