import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface UseIssueActionsProps {
  issueId: string;
  issueNumber: number;
}

export function useIssueActions({
  issueId,
  issueNumber,
}: UseIssueActionsProps) {
  const utils = trpc.useUtils();

  // Mutations
  const assignSelfMutation = trpc.issueAssignSelf.useMutation({
    onSuccess: () => {
      toast.success("Вы назначены исполнителем");
      utils.getById.invalidate({ issueId: issueNumber });
      utils.issueListWeek.invalidate(); // Also invalidate weekly data
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const unassignSelfMutation = trpc.issueUnassignSelf.useMutation({
    onSuccess: () => {
      toast.success("Назначение снято");
      utils.getById.invalidate({ issueId: issueNumber });
      utils.issueListWeek.invalidate(); // Also invalidate weekly data
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Action handlers
  const handleAssignSelf = () => {
    assignSelfMutation.mutate({ issueId: issueNumber });
  };

  const handleUnassignSelf = () => {
    unassignSelfMutation.mutate({ issueId: issueNumber });
  };

  const handleSendForReview = (issueUrl: string) => {
    window.open(issueUrl, "_blank");
    toast.info("Переход к созданию Pull Request на GitHub");
  };

  const handleEditIssue = (issueUrl: string) => {
    window.open(issueUrl, "_blank");
  };

  return {
    // Actions
    handleAssignSelf,
    handleUnassignSelf,
    handleSendForReview,
    handleEditIssue,
    // Mutation states
    isAssigning: assignSelfMutation.isPending,
    isUnassigning: unassignSelfMutation.isPending,
  };
}
