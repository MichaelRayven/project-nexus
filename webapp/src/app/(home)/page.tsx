import { CollaborationSection } from "@/components/collaboration-section";
import { HeroSection } from "@/components/hero-section";
import { TasksSection } from "@/components/tasks-section";
import { WorkflowSection } from "@/components/workflow-section";

export default async function HomePage() {
  return (
    <main>
      <TasksSection />
      <HeroSection />
      <WorkflowSection />
      <CollaborationSection />
    </main>
  );
}
