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

export default async function Layout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

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

  if (!session) {
    return (
      <HomeLayout {...baseOptions()} links={unauthenticatedLinks}>
        {children}
      </HomeLayout>
    );
  } else {
    return (
      <HomeLayout {...baseOptions()} links={authenticatedLinks}>
        {children}
      </HomeLayout>
    );
  }
}
