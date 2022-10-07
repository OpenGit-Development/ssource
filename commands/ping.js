const { SlashCommandBuilder } = require('discord.js');
const client = require("../utils/client");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get the bot\'s ping'),
	async execute(interaction) {
        await interaction.reply(`Pong! ${client.ws.ping}ms`);
	},
};