require("dotenv").config();

import { Octokit, App } from "octokit";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN,
});

await octokit.request("GET /search/repositories", {});
