require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { BOT_TOKEN } = process.env;

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// On ready
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Login
client.login(BOT_TOKEN);