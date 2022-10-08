const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../utils/client");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with \"pong!\" and latency"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#D4AFB9")
      .setTitle("Pong!")
      .setDescription(
        `Roundtrip latency is ${
          Date.now() - interaction.createdTimestamp
        }ms. Websocket heartbeat is ${Math.round(client.ws.ping)}ms`
      )

    await interaction.reply({ embeds: [embed] });
  },
};
