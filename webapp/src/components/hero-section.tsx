import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRightIcon,
  BookOpenIcon,
  GitBranchIcon,
  MessagesSquareIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-24 lg:py-32 bg-background text-foreground">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-8 px-4 py-2">
            <GitBranchIcon className="h-4 w-4 mr-2" />
            <strong>Nexus:</strong> от лат. — «то, что связывает».
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl mb-6">
            Объединяйтесь, сотрудничайте,
            <span className="text-primary"> достигайте успеха вместе</span>
          </h1>

          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto leading-relaxed">
            Nexus позволяет студентам совместно решать задачи используя GitHub.
            Делитесь знаниями, помогайте друг другу, и создавайте проверенные
            решения вместе.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-base px-8">
              Присоединиться
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
            <Link href="/docs">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 bg-transparent"
              >
                База знаний
                <BookOpenIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="border-0 bg-muted/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Совместное решение</h3>
                <p className="text-sm text-muted-foreground">
                  До 10 участников на задание
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-muted/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessagesSquareIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Контроль качества</h3>
                <p className="text-sm text-muted-foreground">
                  Контроль версий и проверка решений
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-muted/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpenIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">База знаний</h3>
                <p className="text-sm text-muted-foreground">
                  Репозиторий готовых и проверенных решений
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
