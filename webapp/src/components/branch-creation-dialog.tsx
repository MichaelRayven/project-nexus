import { IssueNode } from "@/lib/interface";
import { trpc } from "@/trpc/client";
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

interface BranchCreationDialogProps {
  issue: IssueNode;
}

export function BranchCreationDialog({ issue }: BranchCreationDialogProps) {
  const [branchName, setBranchName] = useState("");
  const [isComplete, setIsComplete] = useState(true);

  const utils = trpc.useUtils();
  const mutation = trpc.createLinkedBranch.useMutation({
    onSuccess: () => {
      toast.success("Ветка создана успешно");
      utils.getById.invalidate({ issueId: issue!.number });
      utils.issueListWeek.invalidate(); // Also invalidate weekly data
      setIsComplete(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Generate default branch name when dialog opens
  useEffect(() => {
    if (issue) {
      const escapedTitle = issue.title
        .toLowerCase()
        .replace(/[^а-яa-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

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
          // Branch Creation State
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
          // Instructions State
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
