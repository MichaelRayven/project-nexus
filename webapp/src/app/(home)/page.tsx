import { IssueForm } from "@/components/issue-form";
import { TaskTracker } from "@/components/task-tracker";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Задачи на неделю</h1>
      <TaskTracker/>
    </main>
  );
}
