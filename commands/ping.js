const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../utils/client");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription('Replies with "pong!" and latency'),
  async execute(interaction) {
    // send an initial reply
    await interaction.reply("Pinging...");
    const initialReply = await interaction.fetchReply();
    const latency =
      initialReply.createdTimestamp - interaction.createdTimestamp;

    // create the embed
    const embed = new EmbedBuilder()
      .setColor("#171515")
      .setTitle("Latency information")
      .setDescription(
        `Roundtrip latency is ${latency}ms. Websocket heartbeat is ${Math.round(
          client.ws.ping
        )}ms`
      );

    // edit the initial reply
    await interaction.editReply({ content: "Pong!", embeds: [embed] });
  },
};
