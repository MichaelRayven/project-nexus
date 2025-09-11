import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GitBranchIcon,
  ImagesIcon as IssuesIcon,
  GitPullRequestIcon,
  CheckCircleIcon,
} from "lucide-react";

const workflowSteps = [
  {
    icon: IssuesIcon,
    title: "Create Issue",
    description:
      "Start by creating a GitHub Issue describing your assignment with all necessary details, resources, and requirements.",
  },
  {
    icon: GitBranchIcon,
    title: "Branch & Collaborate",
    description:
      "Create a dedicated branch for your assignment and invite up to 10 collaborators to work together on the solution.",
  },
  {
    icon: GitPullRequestIcon,
    title: "Submit Solution",
    description:
      "Once complete, create a Pull Request with your solution, including documentation and any supporting materials.",
  },
  {
    icon: CheckCircleIcon,
    title: "Review & Merge",
    description:
      "Get feedback from peers and instructors, make improvements, and merge your verified solution to the main branch.",
  },
];

export function WorkflowSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      {/* Added container with proper spacing for workflow cards */}
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            {"How Nexus Works"}
          </h2>
          <p className="text-lg text-muted-foreground mt-4 text-pretty max-w-2xl mx-auto">
            {
              "Our GitHub-based workflow makes collaboration simple and effective. Follow these steps to transform how you approach assignments."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-6xl mx-auto">
          {workflowSteps.map((step, index) => (
            <Card
              key={index}
              className="relative overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-primary">
                    Step {index + 1}
                  </div>
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {step.description}
                </CardDescription>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
