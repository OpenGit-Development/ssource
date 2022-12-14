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
    if (error.status === 403) {
      return "rate_limit_exceeded";
    }
    return null;
  }
};

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
    if (error.status === 403) {
      return "rate_limit_exceeded";
    }
    return null;
  }
};

// Experimental: get a random repository
const getRandomRepository = async () => {
  try {
    const { data } = await octokit.request("GET /repositories");
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (error) {
    if (error.status === 403) {
      return "rate_limit_exceeded";
    }
    return null;
  }
};

// Get a list of repositories based on a certain query
const searchRepositories = async (query, language, limit) => {
  try {
    const { data } = await octokit.request(
      "GET /search/repositories?q={query}+language:{language}&per_page={limit}",
      {
        query,
        language,
        limit,
      }
    );
    return data;
  } catch (error) {
    if (error.status === 403) {
      return "rate_limit_exceeded";
    }
    return null;
  }
};

// Get the current active issues in a repository
const getActiveIssues = async (owner, repo) => {
  try {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/issues?state=open",
      {
        owner,
        repo,
      }
    );
    return data;
  } catch (error) {
    if (error.status === 403) {
      return "rate_limit_exceeded";
    }
    return null;
  }
};

const getUser = async (user) => {
  try {
    const { data } = await octokit.request("GET /users/{user}", {
      user,
    });
    return data;
  } catch (error) {
    if (error.status === 403) {
      return "rate_limit_exceeded";
    }
    return null;
  }
};

const searchUsers = async (query, limit) => {
  try {
    const { data } = await octokit.request(
      "GET /search/users?q={query}&per_page={limit}",
      {
        query,
        limit,
      }
    );
    return data;
  } catch (error) {
    if (error.status === 403) {
      return "rate_limit_exceeded";
    }
    return null;
  }
};

module.exports = {
  getRepositoryInfo,
  getLatestRelease,
  getRandomRepository,
  searchRepositories,
  getActiveIssues,
  getUser,
  searchUsers,
};
