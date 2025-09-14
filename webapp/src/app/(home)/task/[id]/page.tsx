import { notFound } from "next/navigation";
import { TaskPage } from "@/components/task-page";

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskPageRoute({ params }: TaskPageProps) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    notFound();
  }

  return <TaskPage issueId={Number(id)} />;
}

export async function generateMetadata({ params }: TaskPageProps) {
  const { id } = await params;
  return {
    title: `Задача #${id}`,
    description: "Просмотр и управление задачей",
  };
}
