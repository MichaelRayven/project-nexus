import { CollaborationSection } from "@/components/collaboration-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { TasksSection } from "@/components/tasks-section";
import { WorkflowSection } from "@/components/workflow-section";
import { auth } from "@/lib/auth";
import { caller, getQueryClient } from "@/trpc/server";
import { headers } from "next/headers";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const queryClient = getQueryClient();
  const collaborators = await caller.collaboratorsList();
  const isCollaborator = collaborators?.some(
    (collaborator: any) => collaborator.login === session?.user.username
  );

  return (
    // <main className="flex flex-1 flex-col justify-center text-center">
    //   <h1 className="mb-4 text-2xl font-bold">Задачи на неделю</h1>
    //   <TaskTracker/>
    // </main>
    <div className="min-h-screen">
      <main>
        <TasksSection />
        <HeroSection />
        <WorkflowSection />
        <CollaborationSection />
      </main>
      <Footer />
    </div>
  );
}
