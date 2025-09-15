"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserIcon, UserMinusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { IssueNode } from "@/lib/interface";
import { useIssue } from "@/hooks/use-issue";

interface AssignmentButtonProps {
  issue: IssueNode;
}

export function AssignmentButton({ issue }: AssignmentButtonProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Get assignment status using the useIssue hook
  const { isAssignee } = useIssue({ issue });

  // Mutations
  const assignSelfMutation = useMutation(
    trpc.issueAssignSelf.mutationOptions({
      onSuccess: () => {
        toast.success("Вы назначены исполнителем");
        queryClient.invalidateQueries(
          trpc.issueByNumber.queryFilter({ issueNumber: issue!.number })
        );
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
        queryClient.invalidateQueries(
          trpc.issueByNumber.queryFilter({ issueNumber: issue!.number })
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  // Action handlers
  const handleAssignSelf = () => {
    assignSelfMutation.mutate({ issueNumber: issue!.number });
  };

  const handleUnassignSelf = () => {
    unassignSelfMutation.mutate({ issueNumber: issue!.number });
  };

  const isAssigning = assignSelfMutation.isPending;
  const isUnassigning = unassignSelfMutation.isPending;

  // Show loading state if issue is not loaded yet
  if (!issue) {
    return (
      <Button disabled className="w-full" size="sm">
        <UserIcon className="h-4 w-4 mr-2" />
        Загрузка...
      </Button>
    );
  }

  if (!isAssignee) {
    return (
      <Button
        onClick={handleAssignSelf}
        disabled={isAssigning}
        className="w-full"
        size="sm"
      >
        <UserIcon className="h-4 w-4 mr-2" />
        {isAssigning ? "Назначаем..." : "Выполнить"}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleUnassignSelf}
      disabled={isUnassigning}
      variant="outline"
      className="w-full"
      size="sm"
    >
      <UserMinusIcon className="h-4 w-4 mr-2" />
      {isUnassigning ? "Снимаем..." : "Отказаться"}
    </Button>
  );
}
