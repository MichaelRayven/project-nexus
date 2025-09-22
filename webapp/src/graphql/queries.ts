import { gql } from "graphql-request";

export const GetIssuesByLabel = gql`
  query GetIssuesByLabel(
    $owner: String!
    $name: String!
    $labels: [String!]
    $first: Int!
    $orderBy: IssueOrder
  ) {
    repository(owner: $owner, name: $name) {
      issues(first: $first, labels: $labels, orderBy: $orderBy) {
        nodes {
          id
          number
          title
          body
          url
          state
          createdAt
          updatedAt
          closedAt
          author {
            login
            avatarUrl
            url
          }
          assignees(first: 10) {
            nodes {
              id
              login
              avatarUrl
              url
            }
          }
          labels(first: 20) {
            nodes {
              id
              name
              color
              description
            }
          }
          comments {
            totalCount
          }
          milestone {
            id
            number
            title
          }
          linkedBranches(first: 10) {
            nodes {
              id
              ref {
                id
                name
                repository {
                  id
                  name
                  nameWithOwner
                  owner {
                    login
                    __typename
                    id
                  }
                }
              }
            }
          }
          closedByPullRequestsReferences(first: 10) {
            nodes {
              id
              url
              number
              title
              state
              isDraft
              isInMergeQueue
              createdAt
              repository {
                id
                name
                nameWithOwner
                owner {
                  login
                  __typename
                  id
                }
              }
              __typename
            }
          }
        }
      }
    }
  }
`;

export const GetAllRepositoryIssues = gql`
  query GetAllRepositoryIssues(
    $owner: String!
    $name: String!
    $first: Int!
    $orderBy: IssueOrder
  ) {
    repository(owner: $owner, name: $name) {
      issues(first: $first, orderBy: $orderBy) {
        nodes {
          id
          number
          title
          body
          url
          state
          createdAt
          updatedAt
          closedAt
          author {
            login
            avatarUrl
            url
          }
          assignees(first: 10) {
            nodes {
              id
              login
              avatarUrl
              url
            }
          }
          labels(first: 20) {
            nodes {
              id
              name
              color
              description
            }
          }
          comments {
            totalCount
          }
          milestone {
            id
            number
            title
          }
          linkedBranches(first: 10) {
            nodes {
              id
              ref {
                id
                name
                repository {
                  id
                  name
                  nameWithOwner
                  owner {
                    login
                    __typename
                    id
                  }
                }
              }
            }
          }
          closedByPullRequestsReferences(first: 10) {
            nodes {
              id
              url
              number
              title
              state
              isDraft
              isInMergeQueue
              createdAt
              repository {
                id
                name
                nameWithOwner
                owner {
                  login
                  __typename
                  id
                }
              }
              __typename
            }
          }
        }
      }
    }
  }
`;

export const GetIssueByNumber = gql`
  query GetIssueByNumber($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      issue(number: $number) {
        id
        number
        title
        body
        url
        state
        createdAt
        updatedAt
        closedAt
        author {
          login
          avatarUrl
          url
        }
        assignees(first: 10) {
          nodes {
            id
            login
            avatarUrl
            url
          }
        }
        labels(first: 20) {
          nodes {
            id
            name
            color
            description
          }
        }
        comments {
          totalCount
        }
        milestone {
          id
          number
          title
        }
        linkedBranches(first: 10) {
          nodes {
            id
            ref {
              id
              name
              repository {
                id
                name
                nameWithOwner
                owner {
                  login
                  __typename
                  id
                }
              }
            }
          }
        }
        closedByPullRequestsReferences(first: 10) {
          nodes {
            id
            url
            number
            title
            state
            isDraft
            isInMergeQueue
            createdAt
            repository {
              id
              name
              nameWithOwner
              owner {
                login
                __typename
                id
              }
            }
            __typename
          }
        }
      }
    }
  }
`;
