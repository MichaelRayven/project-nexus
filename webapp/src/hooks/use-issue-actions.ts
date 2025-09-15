import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseIssueActionsProps {
  issueId: string;
  issueNumber: number;
}

export function useIssueActions({
  issueId,
  issueNumber,
}: UseIssueActionsProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Mutations
  const assignSelfMutation = useMutation(
    trpc.issueAssignSelf.mutationOptions({
      onSuccess: () => {
        toast.success("Вы назначены исполнителем");
        queryClient.invalidateQueries({
          queryKey: [
            trpc.issueListWeek.queryKey(),
            trpc.getById.queryFilter({ issueId: issueNumber }),
          ],
        }); // Also invalidate weekly data
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const unassignSelfMutation = useMutation(
    trpc.issueUnassignSelf.mutationOptions({
      onSuccess: () => {
        toast.success("Назначение снято");
        queryClient.invalidateQueries({
          queryKey: [
            trpc.issueListWeek.queryKey(),
            trpc.getById.queryFilter({ issueId: issueNumber }),
          ],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

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
