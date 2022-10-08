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

// Experimental: get a random repository
async function getRandomRepository() {
  const { data } = await octokit.request("GET /repositories");
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

// Get a list of repositories based on a certain query
const getRepositories = async (query) => {
  const { data } = await octokit.rest.search.repos({
    q: query,
  });
  return data.items;
};

module.exports = {
  getRepositoryInfo,
  getLatestRelease,
  getRandomRepository,
  getRepositories,
};
