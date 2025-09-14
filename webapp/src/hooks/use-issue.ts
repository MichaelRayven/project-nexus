import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { getIssueStatus } from "@/lib/utils";

interface UseIssueProps {
  issueId: number;
}

export function useIssue({ issueId }: UseIssueProps) {
  const { data: session } = authClient.useSession();

  // Fetch issue data
  const { data: issue, isLoading } = trpc.getById.useQuery({ issueId });

  // Helper functions
  const linkedBranches =
    issue?.linkedBranches?.nodes?.filter((branch) => branch?.ref) ?? [];

  const assignees =
    issue?.assignees?.nodes?.filter((assignee) => assignee !== null) ?? [];

  const labels = issue?.labels?.nodes?.filter((label) => label !== null) ?? [];

  const pullRequests =
    issue?.closedByPullRequestsReferences?.nodes?.filter((pr) => pr !== null) ??
    [];

  const isAssignee = issue?.assignees?.nodes?.some(
    (assignee) => assignee?.login === session?.user.username
  );

  const status = issue ? getIssueStatus(issue) : null;

  // Extract labels and metadata

  const teacherIdx = labels.findIndex((label) =>
    label?.name?.startsWith("Преподаватель:")
  );
  const teacherLabel =
    teacherIdx !== -1 ? labels.splice(teacherIdx, 1)[0] : undefined;

  const subjectIdx = labels.findIndex((label) =>
    label?.name?.startsWith("Предмет:")
  );
  const subjectLabel =
    subjectIdx !== -1 ? labels.splice(subjectIdx, 1)[0] : undefined;

  const deadlineIdx = labels.findIndex((label) =>
    label?.name?.startsWith("Дедлайн:")
  );
  const deadlineLabel =
    deadlineIdx !== -1 ? labels.splice(deadlineIdx, 1)[0] : undefined;

  const durationIdx = labels.findIndex((label) =>
    label?.name?.startsWith("Длительность:")
  );
  const durationLabel =
    durationIdx !== -1 ? labels.splice(durationIdx, 1)[0] : undefined;

  const categoryIdx = labels.findIndex((label) =>
    label?.name?.startsWith("Категория:")
  );
  const categoryLabel =
    categoryIdx !== -1 ? labels.splice(categoryIdx, 1)[0] : undefined;

  return {
    // Data
    issue,
    isLoading,

    // Computed values
    linkedBranches,
    pullRequests,
    assignees,
    isAssignee,
    status,
    labels,
    teacherLabel,
    subjectLabel,
    deadlineLabel,
    durationLabel,
    categoryLabel,
  };
}
