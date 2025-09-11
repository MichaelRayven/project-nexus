import { CollaborationSection } from "@/components/collaboration-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { IssueForm } from "@/components/issue-form";
import { TaskTracker } from "@/components/task-tracker";
import { WorkflowSection } from "@/components/workflow-section";

export default function HomePage() {
  return (
    // <main className="flex flex-1 flex-col justify-center text-center">
    //   <h1 className="mb-4 text-2xl font-bold">Задачи на неделю</h1>
    //   <TaskTracker/>
    // </main>
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <WorkflowSection />
        <CollaborationSection />
      </main>
      <Footer />
    </div>
  );
}
