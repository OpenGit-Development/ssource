const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getRepositoryInfo, getRandomRepository } = require("../api/octokit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Get a random repository on GitHub"),

  async execute(interaction) {
    const randomRepository = await getRandomRepository();
    const info = await getRepositoryInfo(
      randomRepository.owner.login,
      randomRepository.name
    );

    const embed = new EmbedBuilder()
      .setColor("#171515")
      .setTitle(info.full_name)
      .setDescription(info.description)

      // languages
      .addFields(
        { name: "Languages", value: info.language, inline: true },
        {
          name: "Stars",
          value: info.stargazers_count.toString(),
          inline: true,
        },
        { name: "Forks", value: info.forks_count.toString(), inline: true }
      )

      .setURL(info.html_url)
      .setThumbnail(info.owner.avatar_url);

    await interaction.reply({ embeds: [embed] });
  },
};
