import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { BookIcon, PlusIcon } from "lucide-react";
import { LogInButton } from "@/components/login-button";
import { UserDropdown } from "@/components/user-dropdown";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { IssueDialog } from "@/components/issue-dialog";
import { Button } from "@/components/ui/button";
import { LinkItemType } from "fumadocs-ui/layouts/links";
import { Footer } from "@/components/layout/footer";

const commonLinks: LinkItemType[] = [
  {
    icon: <BookIcon />,
    text: "База знаний",
    url: "/docs",
    active: "nested-url",
    secondary: false,
  },
];

const unauthenticatedLinks: LinkItemType[] = [
  ...commonLinks,
  {
    type: "custom",
    children: <LogInButton />,
    secondary: true,
  },
];

const authenticatedLinks: LinkItemType[] = [
  ...commonLinks,
  {
    type: "custom",
    children: (
      <div className="flex gap-2">
        <UserDropdown />
        <IssueDialog
          trigger={
            <Button>
              <PlusIcon />
              <span>Задача</span>
            </Button>
          }
        />
      </div>
    ),
    secondary: true,
  },
];

const footerItems = [
  {
    name: "Платформа",
    children: [
      {
        url: "#",
        name: "Возможности",
      },
      {
        url: "#",
        name: "Рабочий процесс",
      },
      {
        url: "#",
        name: "Сотрудничество",
      },
      {
        url: "#",
        name: "Документация",
      },
    ],
  },
  {
    name: "Поддержка",
    children: [
      {
        url: "#",
        name: "Центр помощи",
      },
      {
        url: "#",
        name: "Сообщество",
      },
      {
        url: "#",
        name: "Контакты",
      },
      {
        url: "#",
        name: "Статус",
      },
    ],
  },
];

export default async function Layout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <HomeLayout {...baseOptions()} links={unauthenticatedLinks}>
        {children}
        <Footer items={footerItems} />
      </HomeLayout>
    );
  } else {
    return (
      <HomeLayout {...baseOptions()} links={authenticatedLinks}>
        {children}
        <Footer items={footerItems} />
      </HomeLayout>
    );
  }
}
