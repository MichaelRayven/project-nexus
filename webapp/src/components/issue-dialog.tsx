"use client";

import { useState } from "react";
import { IssueForm } from "./issue-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function IssueDialog({
  trigger,
  initialDeadline,
}: {
  trigger?: React.ReactNode;
  initialDeadline?: Date;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-3 sm:p-6 sm:max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle>Добавить задачу</DialogTitle>
          <DialogDescription>
            Подробно опишите задачу, чтобы выполняющие её знали, что делать. Не
            забудьте добавить ссылки на все необходимые ресурсы.
          </DialogDescription>
        </DialogHeader>
        <IssueForm
          onIssueAdded={() => setOpen(false)}
          initialDeadline={initialDeadline}
        />
      </DialogContent>
    </Dialog>
  );
}
