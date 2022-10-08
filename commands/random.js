const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getRepositoryInfo, getRandomRepository } = require("../api/octokit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Get a random repository on GitHub"),

  async execute(interaction) {
    await interaction.deferReply();
    const randomRepository = await getRandomRepository();
    const info = await getRepositoryInfo(
      randomRepository.owner.login,
      randomRepository.name
    );

    const embed = new EmbedBuilder()
      .setColor("#171515")
      .setTitle(info.full_name)
      .setDescription(info.description)
      
      .setURL(info.html_url)
      .setThumbnail(info.owner.avatar_url);

    await interaction.editReply({ embeds: [embed] });
  },
};
