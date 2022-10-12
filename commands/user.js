const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const { getUser, searchUsers } = require("../api/octokit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Search for a user on Github")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The username to get information about")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("The maximum number of results to return")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getString("query");
    const limit = interaction.options.getInteger("limit") || 5;

    const results = await getUser(user);

    // console.log(results);

    if (!results) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription(`Could not find a user with the username ${user}.`);

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    if (results === "rate limit exceeded") {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Rate limit exceeded.");

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    const userEmbed = new EmbedBuilder()
      .setColor("#171515")
      .setTitle(results.login)
      .setDescription(results.bio)
      .addFields(
        {
          name: "Location",
          value: results.location || "Unknown",
          inline: true,
        },
        {
          name: "Followers",
          value: results.followers.toString() || "0",
          inline: true,
        },
        {
          name: "Public repositories",
          value: results.public_repos.toString() || "0",
          inline: true,
        }
      )
      .setThumbnail(results.avatar_url);

    // send another message with similar users
    const similarUsers = await searchUsers(user, limit);

    if (similarUsers.length === 0) return;

    if (similarUsers === "rate limit exceeded") {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Error")
        .setDescription("Rate limit exceeded.");

      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    const similarUsersArray = similarUsers.items.map((user) => user.login);
    similarUsersArray.shift();

    const similarUsersEmbed = new EmbedBuilder()
      .setColor("#171515")
      .setTitle("Similar users")
      .setDescription(
        similarUsersArray.join(", ") || "No similar users found."
      )
      .setTimestamp(new Date());

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("View on Github")
        .setURL(results.html_url)
    );

    await interaction.reply({
      embeds: [userEmbed, similarUsersEmbed],
      components: [row],
    });
  },
};
