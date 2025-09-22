import { GetAllRepositoryIssuesQuery } from "../graphql/types";

export type IssueNode = NonNullable<
  NonNullable<GetAllRepositoryIssuesQuery["repository"]>["issues"]["nodes"]
>[number];
