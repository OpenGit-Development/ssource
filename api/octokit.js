require("dotenv").config();

import { Octokit, App } from "octokit";

// Octokit.js
const octokit = new Octokit({
  // Personal Access token (silvermango) hidden in .env locally
  auth: process.env.ACCESS_TOKEN,
});

await octokit.request("GET /search/repositories", {});
