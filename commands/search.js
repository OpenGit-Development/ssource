const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const { searchRepositories } = require("../api/octokit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search for a repository on GitHub")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The query to search for")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("The language to search for")
        .addChoices(
          // TODO: Figure out a way to get the languages dynamically
          { name: "JavaScript", value: "javascript" },
          { name: "TypeScript", value: "typescript" },
          { name: "Python", value: "python" },
          { name: "Java", value: "java" },
          { name: "C#", value: "c#" },
          { name: "C++", value: "c++" },
          { name: "C", value: "c" },
          { name: "Go", value: "go" },
          { name: "Ruby", value: "ruby" },
          { name: "PHP", value: "php" },
          { name: "Swift", value: "swift" },
          { name: "Kotlin", value: "kotlin" },
          { name: "Rust", value: "rust" },
          { name: "Dart", value: "dart" }
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("The maximum number of results to return")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("chunk")
        .setDescription("The chunk of results to return per page")
        .setRequired(false)
    ),

  async execute(interaction) {
    const query = interaction.options.getString("query");
    const language = interaction.options.getString("language");
    const limit = interaction.options.getInteger("limit") || 24;
    const chunk = interaction.options.getInteger("chunk") || 3;

    // Limit the maximum number of results to 24
    if (limit > 24) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("The limit cannot be greater than 24.");

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    const results = await searchRepositories(query, language, limit);

    if (results === "rate limit exceeded") {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Rate limit exceeded.");

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    // console.log(results.items.map((item) => item.full_name));

    // If the results are empty, it means that no repositories were found
    if (results.items.length === 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription(
          `Could not find any repositories for ${query} in ${language}.`
        )
        .addFields();

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    // Create an array of arrays for 5 repositories at a time
    const embeds = [];

    for (let i = 0; i < results.items.length; i += chunk) {
      const temp = results.items.slice(i, i + chunk);
      embeds.push(temp);
    }

    // console.log(embeds);

    let currentPage = 0;

    // Create the embed to send
    const embed = new EmbedBuilder()
      .setColor("#171515")
      .setTitle(`Results for "${query}" in ${language}`)
      .setDescription(
        `Page ${currentPage + 1} of ${embeds.length} (${
          results.items.length
        } results)`
      )
      .addFields(
        embeds[currentPage].map((item) => {
          return {
            name:
              item.full_name +
              ` (${item.open_issues_count} open issues available)`,
            value:
              (item.description || "No description") + "\n" + item.html_url,
            inline: true,
          };
        })
      )
      .setTimestamp(new Date());

    // Create the buttons
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Previous")
        .setCustomId("previous")
        .setDisabled(embeds.length === 1),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Next")
        .setCustomId("next")
        .setDisabled(embeds.length === 1)
    );

    // Send the embed
    await interaction.reply({ embeds: [embed], components: [buttons] });

    // Collector stuff
    const filter = (i) => i.customId === "previous" || i.customId === "next";

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000, // 60 seconds
    });

    // Users can keep clicking a button until the collector times out or they reach the end of the embeds
    collector.on("collect", async (i) => {
      if (i.customId === "previous") {
        if (currentPage === 0) {
          await i.update({
            embeds: [embed],
            components: [buttons],
          });
          return;
        }

        currentPage--;
      } else if (i.customId === "next") {
        if (currentPage < embeds.length - 1) {
          currentPage += 1;
        }

        // If the user reaches the end of the embeds, disable the next button
        if (currentPage === embeds.length - 1) {
          await i.update({
            embeds: [
              new EmbedBuilder()
                .setColor("#171515")
                .setTitle(`Results for "${query}" in ${language}`)
                .setDescription(
                  `Page ${currentPage + 1} of ${embeds.length} (${
                    results.items.length
                  } results)`
                )
                .addFields(
                  embeds[currentPage].map((item) => {
                    return {
                      name:
                        item.full_name +
                        ` (${item.open_issues_count} open issues available)`,
                      value:
                        (item.description || "No description") +
                        "\n" +
                        item.html_url,
                      inline: true,
                    };
                  })
                )
                .setTimestamp(new Date()),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("previous")
                  .setLabel("Previous")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("next")
                  .setLabel("Next")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          return;
        }
      }

      // Update the embed
      await i.update({
        embeds: [
          new EmbedBuilder()
            .setColor("#171515")
            .setTitle(`Results for "${query}" in ${language}`)
            .setDescription(
              `Page ${currentPage + 1} of ${embeds.length} (${
                results.items.length
              } results)`
            )
            .addFields(
              embeds[currentPage].map((item) => {
                return {
                  name:
                    item.full_name +
                    ` (${item.open_issues_count} open issues available)`,
                  value:
                    (item.description || "No description") +
                    "\n" +
                    item.html_url,
                  inline: true,
                };
              })
            )
            .setTimestamp(new Date()),
        ],
        components: [buttons],
      });
    });

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        await interaction.editReply({
          embeds: [embed],
          components: [],
        });
      }

      // If the collector times out, disable the buttons
      await interaction.editReply({
        embeds: [embed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("previous")
              .setLabel("Previous")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("next")
              .setLabel("Next")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true)
          ),
        ],
      });
    });
  },
};
