const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");
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
      )
      .setTimestamp(new Date());

    // create the button
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Ping again")
        .setCustomId("ping")
    );

    // edit the initial reply
    await interaction.editReply({ content: "Pong!", embeds: [embed], components: [row] });
    
    const filter = (i) => i.customId === "ping" && i.user.id === interaction.user.id;

    // wait for the button to be clicked
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "ping") {
        // send a new reply
        await i.reply("Pinging...");
        const newReply = await i.fetchReply();
        const newLatency =
          newReply.createdTimestamp - i.createdTimestamp;

        // create the embed
        const newEmbed = new EmbedBuilder()
          .setColor("#171515")
          .setTitle("Latency information")
          .setDescription(
            `Roundtrip latency is ${newLatency}ms. Websocket heartbeat is ${Math.round(
              client.ws.ping
            )}ms`
          )
          .setTimestamp(new Date());

        // edit the reply and remove the button
        await i.editReply({ content: "Pong!", embeds: [newEmbed], components: [] });
      }
    });

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        // if the button wasn't clicked, remove the button
        await interaction.editReply({ components: [] });
      }
    });
    
  },
};
