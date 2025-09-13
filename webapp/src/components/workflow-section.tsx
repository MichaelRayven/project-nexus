import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircleIcon,
  FoldersIcon,
  GitBranchIcon,
  ListChecksIcon,
  ListTodoIcon,
  MessagesSquareIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react";

const workflowSteps = [
  {
    icon: ListTodoIcon,
    title: "Выберите задачу",
    description:
      "Выберите задачу, которую хотите решить и назначьте себя исполнителем.",
  },
  {
    icon: GitBranchIcon,
    title: "Создайте ветку",
    description: "Создайте ветку под текущую задачу.",
  },
  {
    icon: FoldersIcon,
    title: "Подготовка",
    description: "Создайте необходимые папки и начинайте работу.",
  },
  {
    icon: ListChecksIcon,
    title: "Решение задачи",
    description: "Запишите решение задачи в формате MDX.",
  },
  {
    icon: UsersIcon,
    title: "Работайте в команде",
    description:
      "Пользуйтесь помощью остальных участников. До 10 чел. на задачу.",
  },
  {
    icon: SendIcon,
    title: "Отправьте решение",
    description:
      "Откройте Pull Request в основную ветку с описанием выполненной задачи.",
  },
  {
    icon: MessagesSquareIcon,
    title: "Контроль качества",
    description:
      "Получите обратную связь от остальных участников и внесите правки.",
  },
  {
    icon: CheckCircleIcon,
    title: "Завершите задачу",
    description: "Завершите задачу и опубликуйте решение на сайте.",
  },
];

export function WorkflowSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      {/* Added container with proper spacing for workflow cards */}
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Как работает Nexus
          </h2>
          <p className="text-lg text-muted-foreground mt-4 text-pretty max-w-2xl mx-auto">
            Наш GitHub-based workflow делает совместную работу простой и
            эффективной. Следуйте этим шагам, чтобы изменить подход к выполнению
            заданий.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-fd-container mx-auto">
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
                    Шаг {index + 1}
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
