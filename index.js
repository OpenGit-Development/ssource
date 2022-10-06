require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_BOT_TOKEN } = process.env;

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// On ready
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Login
try {
  client.login(DISCORD_BOT_TOKEN);
} catch (error) {
  console.error(error);
}
