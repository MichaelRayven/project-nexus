import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { BookIcon, PlusIcon } from "lucide-react";
import { LogInButton } from "@/components/login-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IssueDialog } from "@/components/issue-dialog";
import { Button } from "@/components/ui/button";

export default async function Layout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return (
    <HomeLayout
      {...baseOptions()}
      title="test"
      links={[
        {
          icon: <BookIcon />,
          text: "База знаний",
          url: "/docs",
          active: "nested-url",
          secondary: false,
        },
        {
          type: "custom",
          children: (
            <>
              {session ? (
                <div className="flex gap-4">
                  <Avatar>
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback>
                    {session.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <IssueDialog trigger={
                  <Button>
                    <PlusIcon />
                    <span>Задача</span>
                  </Button>
                }></IssueDialog>
                </div>
              ) : (
                <LogInButton />
              )}
            </>
          ),
          secondary: true,
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
