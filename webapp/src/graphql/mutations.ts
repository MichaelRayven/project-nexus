import { gql } from "graphql-request";

export const CreateLinkedBranch = gql`
  mutation CreateLinkedBranch($input: CreateLinkedBranchInput!) {
    createLinkedBranch(input: $input) {
      clientMutationId
      issue {
        id
      }
      linkedBranch {
        id
      }
    }
  }
`;
