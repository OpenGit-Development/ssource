const { Client, GatewayIntentBits } = require("discord.js");

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

module.exports = client;