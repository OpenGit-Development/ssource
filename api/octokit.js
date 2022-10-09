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
const getRepositoryInfo = async (owner, repository) => {
  try {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
      owner,
      repo: repository,
    });
    return data;
  } catch (error) {
    return null;
  }
}

// Get the latest release for a repository
const getLatestRelease = async (owner, repository) => {
  try {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/releases/latest",
      {
        owner,
        repo: repository,
      }
    );
    return data;
  } catch (error) {
    return null;
  }
}

// Experimental: get a random repository
const getRandomRepository = async () => {
  const { data } = await octokit.request("GET /repositories");
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

// Get a list of repositories based on a certain query
const getRepositories = async (query) => {
  try {
    const { data } = await octokit.request("GET /search/repositories", {
      q: query,
    });
    return data;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getRepositoryInfo,
  getLatestRelease,
  getRandomRepository,
  getRepositories,
};
