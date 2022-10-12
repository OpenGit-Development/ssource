# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Discord bot token](https://discord.com/developers/applications)
- [GitHub API token](https://github.com/settings/tokens)

## Installation

1.  Clone the repo

```sh
git clone https://github.com/OpenGit-Development/ssource.git
```

2.  Install NPM packages

```sh
npm install
```

or

```sh
yarn install
```

## Usage

1.  Create a `.env` file in the root directory of the project
2.  Add the following environment variables to the `.env` file

```env
DISCORD_TOKEN=your_discord_token
GITHUB_TOKEN=your_github_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_GUILD_ID=your_discord_guild_id
```

3.  Run the bot

```sh
yarn deploy-commands && yarn start
```
