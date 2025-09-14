import { GraphQLClient } from "graphql-request";

// Create GraphQL client instance
export const githubGraphQL = new GraphQLClient(
  "https://api.github.com/graphql",
  {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    errorPolicy: "all",
  }
);
