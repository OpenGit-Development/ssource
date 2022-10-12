const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
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
    ),

  async execute(interaction) {
    const query = interaction.options.getString("query");
    const language = interaction.options.getString("language");
    const limit = interaction.options.getInteger("limit") || 5;

    // Limit the maximum number of results to 25
    if (limit > 25) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("The limit cannot be greater than 25.");

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

    // Create the embed
    const embed = new EmbedBuilder()
      .setColor("#171515")
      .setTitle(`Search results for "${query}" in ${language}`)
      .setDescription(
        `Found ${results.total_count} repositories. Showing ${results.items.length} results.`
      )

      // repositories
      .addFields(
        results.items.map((item) => {
          return {
            name: item.full_name,
            value:
              (item.description || "No description") +
              "\n" +
              item.html_url +
              "\n" +
              `"You can work on ${item.open_issues_count} open issues"`,
            inline: false,
          };
        })
      );

    await interaction.reply({ embeds: [embed] });
  },
};
