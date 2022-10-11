const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUsers } = require("../api/octokit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Search for a user on Github")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The username to search for")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getString("user");

    const results = await getUsers(user);

    if (results === "rate limit exceeded") {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Rate limit exceeded.");

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    // If the results are empty, it means that no repositories were found
    if (results.items.length === 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription(`Could not find any user for the username, ${user}.`)
        .addFields();

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    // Create the embed
    const embed = new EmbedBuilder()
      .setColor("#50C878")
      .setTitle(`Search results for "${user}"`)
      .setDescription(
        `Found ${results.total_count} users. Showing ${results.items.length} users.`
      )

      // repositories
      .addFields(
        results.items.map((item) => {
          return {
            name: item.login,
            value: item.html_url,
            inline: false,
          };
        })
      );

    await interaction.reply({ embeds: [embed] });
  },
};
