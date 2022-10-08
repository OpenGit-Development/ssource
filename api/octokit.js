require("dotenv").config();

const { Octokit } = require("@octokit/core");

// Octokit.js
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Get the authenticated user to check if the token is valid
octokit.request("GET /user").then(({ data }) => {
  if (data === null) {
    console.error(
      "Error: Invalid token. Please check your .env file and update the GITHUB_TOKEN value."
    );
  } else {
    console.log("Octokit login successful!");
    // console.log(data);
  }
});

// Get general information about a repository
async function getRepositoryInfo(owner, repository) {
  const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
    owner,
    repo: repository,
  });

  return data;
}

// Get the latest release for a repository
async function getLatestRelease(owner, repository) {
  const { data } = await octokit.request(
    `GET /repos/${owner}/${repository}/releases/latest`,
    {
      owner,
      repo: repository,
    }
  );
  return data;
}

module.exports = {
  getRepositoryInfo,
  getLatestRelease,
};
