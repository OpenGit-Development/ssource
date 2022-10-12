# Commands

## Get Repositories

This command returns a list of repositories which match the query and parameters fed in by the user. There is also an `Active Issues` section which displays the number of active issues present that can be contributed to.

`/search`

- Query : The search term for repos
- Language : The programming language you are targetting
- Limit (optional) : The number of results you get
- Chunk (optional) : The chunk of results to return per page

[Note : If no such repository is found, `Could not find any repositories for {repository} in {language}.` will be displayed]

## Get a random repository

This command returns a single random repository from the Github database with no internal sorting or algorithm.

`/random`

[ Note : This is a command requiring no parameters. ]

## Get users

This command allows you to search for users and get a single user in response. Another embed will display names which closely but not exactly match the username input.

`/user`

- username : The username of the Github user to search for

[Note : If no such user is found, `Could not find a user with the username {username}`]

## Get latest release

This command fetches the latest release of a repository and its details. The command works only for repositories which have a public release currently.

`/release`

- Repository : The name of the repository you want to search the latest release for

[Note : If no such release is found, `Invalid repository: {repository}. Please use the format owner/repository.` is the error returned]
