import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRightIcon,
  GitBranchIcon,
  UsersIcon,
  BookOpenIcon,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-24 lg:py-32 bg-background text-foreground">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-8 px-4 py-2">
            <GitBranchIcon className="h-4 w-4 mr-2" />
            from Latin nexus "that which binds together"
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl mb-6">
            Connect, Collaborate,
            <span className="text-primary"> Succeed Together</span>
          </h1>

          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto leading-relaxed">
            Nexus empowers students to work together on assignments using
            GitHub-based workflows. Share knowledge, divide responsibilities,
            and build verified solutions collaboratively.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-base px-8">
              Get Started
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 bg-transparent"
            >
              View Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="border-0 bg-muted/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Team Assignments</h3>
                <p className="text-sm text-muted-foreground">
                  Up to 10 collaborators per project
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-muted/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <GitBranchIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">GitHub Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Industry-standard version control
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-muted/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpenIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Knowledge Base</h3>
                <p className="text-sm text-muted-foreground">
                  Verified solutions repository
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
