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
  const hasLinkedBranches = (issue?.linkedBranches?.nodes?.length ?? 0) > 0;
  const hasPullRequests =
    (issue?.closedByPullRequestsReferences?.nodes?.length ?? 0) > 0;
  const isAssignee = issue?.assignees?.nodes?.some(
    (assignee) => assignee?.login === session?.user.username
  );
  const canCreateBranch = isAssignee && !hasLinkedBranches && !hasPullRequests;
  const status = issue ? getIssueStatus(issue) : null;

  // Extract labels and metadata
  const labels = issue ? [...(issue.labels?.nodes || [])] : [];
  const teacherIdx = labels.findIndex((label) =>
    label?.name?.includes("Преподаватель:")
  );
  const teacherLabel =
    teacherIdx !== -1 ? labels.splice(teacherIdx, 1)[0] : undefined;

  const subjectIdx = labels.findIndex((label) =>
    label?.name?.includes("Предмет:")
  );
  const subjectLabel =
    subjectIdx !== -1 ? labels.splice(subjectIdx, 1)[0] : undefined;

  const deadlineIdx = labels.findIndex(
    (label) =>
      label?.name?.includes("дедлайн:") || label?.name?.includes("Дедлайн:")
  );
  const deadlineLabel =
    deadlineIdx !== -1 ? labels.splice(deadlineIdx, 1)[0] : undefined;

  const durationIdx = labels.findIndex((label) =>
    label?.name?.includes("Длительность:")
  );
  const durationLabel =
    durationIdx !== -1 ? labels.splice(durationIdx, 1)[0] : undefined;

  const categoryIdx = labels.findIndex((label) =>
    label?.name?.includes("Категория:")
  );
  const categoryLabel =
    categoryIdx !== -1 ? labels.splice(categoryIdx, 1)[0] : undefined;

  return {
    // Data
    issue,
    isLoading,
    session,

    // Computed values
    hasLinkedBranches,
    hasPullRequests,
    isAssignee,
    canCreateBranch,
    status,
    labels,
    teacherLabel,
    subjectLabel,
    deadlineLabel,
    durationLabel,
    categoryLabel,
  };
}
