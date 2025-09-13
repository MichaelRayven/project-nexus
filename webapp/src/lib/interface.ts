import { GetIssuesByLabelQuery } from "../graphql/types";

export type IssueNode = NonNullable<
  NonNullable<GetIssuesByLabelQuery["repository"]>["issues"]["nodes"]
>[number];
