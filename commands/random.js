const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const { getRepositoryInfo, getRandomRepository } = require("../api/octokit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Get a random repository on GitHub"),

  async execute(interaction) {
    const randomRepository = await getRandomRepository();

    if (randomRepository === "rate limit exceeded") {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Rate limit exceeded.");

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

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
        { name: "Languages", value: info.language || "Unknown", inline: true },
        {
          name: "Stars",
          value: info.stargazers_count.toString() || "Unknown",
          inline: true,
        },
        {
          name: "Forks",
          value: info.forks_count.toString() || "Unknown",
          inline: true,
        }
      )
      .setThumbnail(info.owner.avatar_url)
      .setTimestamp(new Date());

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("View on GitHub")
          .setURL(info.html_url)
      )
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel("Get another random repository")
          .setCustomId("random")
      );

    await interaction.reply({ embeds: [embed], components: [row] });

    const filter = (i) => i.customId === "random";

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "random") {
        // Get a new random repository
        const newRandomRepository = await getRandomRepository();

        if (newRandomRepository === "rate limit exceeded") {
          const errorEmbed = new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle("Error")
            .setDescription("Rate limit exceeded.");

          await interaction.reply({ embeds: [errorEmbed] });
          return;
        }

        const newInfo = await getRepositoryInfo(
          newRandomRepository.owner.login,
          newRandomRepository.name
        );

        const newEmbed = new EmbedBuilder()
          .setColor("#171515")
          .setTitle(newInfo.full_name)
          .setDescription(newInfo.description)
          .addFields(
            {
              name: "Languages",
              value: newInfo.language || "Unknown",
              inline: true,
            },
            {
              name: "Stars",
              value: newInfo.stargazers_count.toString() || "Unknown",
              inline: true,
            },
            {
              name: "Forks",
              value: newInfo.forks_count.toString() || "Unknown",
              inline: true,
            }
          )
          .setTimestamp(new Date());

        await i.update({ embeds: [newEmbed] });
      }
    });

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        await interaction.editReply({ components: [] });
      }

      // When the collector times out, disable the button that gets a new random repository
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("View on GitHub")
          .setURL(info.html_url),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel("Get another random repository")
          .setCustomId("random")
          .setDisabled(true)
      );

      await interaction.editReply({ components: [disabledRow] });
    });
  },
};
