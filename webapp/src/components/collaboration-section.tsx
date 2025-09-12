import { Button } from "@/components/ui/button";
import { NetworkGraph } from "./network-graph";
import {
  UsersIcon,
  BookOpenIcon,
  TrendingUpIcon,
  HeartHandshakeIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    icon: UsersIcon,
    title: "Учитесь вместе",
    description:
      "Работайте вместе с одногруппниками для решения сложных задач и эффективного обмена знаниями.",
  },
  {
    icon: BookOpenIcon,
    title: "Делитесь знаниями",
    description:
      "Создайте репозиторий проверенных решений, которые будут полезны для текущих и будущих студентов.",
  },
  {
    icon: TrendingUpIcon,
    title: "Развивайте свои навыки",
    description:
      "Изучайте инструменты Git и GitHub для улучшения своих навыков в командной работе.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Помогайте друг другу",
    description:
      "Получайте помощь, когда вам нужна, и помогайте другим успешно завершить свою учебную деятельность.",
  },
];

export function CollaborationSection() {
  return (
    <section id="collaboration" className="py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-balance mb-6">
              Сильнее вместе
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Nexus преврашает индивидуальные задания в возможность учиться друг
              у друга и развиваться вместе. Решайте задачи вместе и помогайте
              другим успешно завершить свою учебную деятельность.
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
              <div>
                <Button size="lg" className="text-base px-8">
                  Присоединиться
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
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
          </div>

          <div className="lg:block hidden">
            <NetworkGraph />
          </div>
        </div>
      </div>
    </section>
  );
}
