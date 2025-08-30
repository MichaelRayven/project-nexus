import { IssueForm } from "./issue-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function IssueDialog({ trigger }: { trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] w-auto">
        <DialogHeader>
          <DialogTitle>Добавить задачу</DialogTitle>
          <DialogDescription>
            Подробно опишите задачу, чтобы выполняющие её знали, что делать. Не забудьте добавить ссылки на все необходимые ресурсы.
          </DialogDescription>
        </DialogHeader>
        <IssueForm />
      </DialogContent>
    </Dialog>
  );
}
