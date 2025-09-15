import { IssueNode } from "@/lib/interface";
import { GitBranchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BranchCreationDialogProps {
  issue: IssueNode;
}

export function BranchCreationDialog({ issue }: BranchCreationDialogProps) {
  const [branchName, setBranchName] = useState("");
  const [isComplete, setIsComplete] = useState(true);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    trpc.createLinkedBranch.mutationOptions({
      onSuccess: () => {
        toast.success("Ветка создана успешно");
        queryClient.invalidateQueries(
          trpc.issueByNumber.queryFilter({ issueNumber: issue!.number })
        );
        setIsComplete(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  useEffect(() => {
    if (issue) {
      const escapedTitle = issue.title
        .toLowerCase()
        .replace(/[^а-яa-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const defaultName = `${issue.number}-${escapedTitle}`;
      setBranchName(defaultName);
    }
  }, [issue?.title, issue?.number]);

  const handleSubmit = () => {
    if (branchName.trim()) {
      mutation.mutate({
        issueId: issue!.id,
        name: branchName.trim(),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !mutation.isPending) {
      handleSubmit();
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setIsComplete(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" size="sm">
          <GitBranchIcon className="h-4 w-4 mr-2" />
          Создать ветку
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        {!isComplete ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GitBranchIcon className="h-5 w-5" />
                Создать ветку
              </DialogTitle>
              <DialogDescription>
                Введите название для новой ветки или используйте предложенное по
                умолчанию.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="branch-name">Название ветки</Label>
                <Input
                  id="branch-name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Введите название ветки"
                  disabled={mutation.isPending}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Ветка будет создана на основе последнего коммита в main.
                </p>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={mutation.isPending}>
                  Отмена
                </Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                disabled={mutation.isPending || !branchName.trim()}
              >
                {mutation.isPending ? "Создаем..." : "Создать ветку"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GitBranchIcon className="h-5 w-5" />
                Ветка создана успешно!
              </DialogTitle>
              <DialogDescription>
                Выполните следующие команды, чтобы начать работу с новой веткой
                локально.
              </DialogDescription>
            </DialogHeader>

            <h3 className="text-lg font-semibold">
              Команды для локального checkout'а
            </h3>
            <Card>
              <CardContent className="font-mono text-sm">
                git fetch <br /> git checkout {branchName}
              </CardContent>
            </Card>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button>Понятно</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
