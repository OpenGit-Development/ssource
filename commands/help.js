const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require("discord.js");
const client = require("../utils/client");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with a list of commands"),
  async execute(interaction) {
    const commands = client.commands
      .map((command) => {
        return {
          name: command.data.name,
          description: command.data.description,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const embed = new EmbedBuilder()
      .setColor("#D4AFB9")
      .setTitle("Commands")
      .addFields(
        commands.map((command) => {
          return {
            name: command.name,
            value:
              command.description +
              `\nUsage: ${inlineCode("/" + command.name)}`,
            inline: true,
          };
        })
      )
      .setTimestamp(new Date());
    await interaction.reply({ embeds: [embed] });
  },
};
