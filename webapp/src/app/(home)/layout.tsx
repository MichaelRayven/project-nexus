import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { BookIcon } from "lucide-react";
import { LogInButton } from "@/components/login-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
                <Avatar>
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback>
                    {session.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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
