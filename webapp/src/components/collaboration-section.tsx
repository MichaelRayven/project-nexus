import { Button } from "@/components/ui/button";
import { NetworkGraph } from "./network-graph";
import {
  UsersIcon,
  BookOpenIcon,
  TrendingUpIcon,
  HeartHandshakeIcon,
} from "lucide-react";

const benefits = [
  {
    icon: UsersIcon,
    title: "Team Learning",
    description:
      "Work together with classmates to solve complex problems and share knowledge effectively.",
  },
  {
    icon: BookOpenIcon,
    title: "Knowledge Sharing",
    description:
      "Build a repository of verified solutions that benefit current and future students.",
  },
  {
    icon: TrendingUpIcon,
    title: "Skill Development",
    description:
      "Learn industry-standard tools like Git and GitHub while improving your collaborative skills.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Peer Support",
    description:
      "Get help when you need it and help others succeed in their academic journey.",
  },
];

export function CollaborationSection() {
  return (
    <section id="collaboration" className="py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-balance mb-6">
              {"Stronger Together"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              {
                "Nexus transforms individual assignments into collaborative learning experiences. Connect with peers, share knowledge, and build solutions that benefit everyone."
              }
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                    <benefit.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1 sm:flex-none">
                Start Collaborating
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none bg-transparent"
              >
                View Examples
              </Button>
            </div>
          </div>

          <div>
            <NetworkGraph />
          </div>
        </div>
      </div>
    </section>
  );
}
