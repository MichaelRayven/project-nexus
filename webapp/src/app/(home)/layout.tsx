import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { BookIcon } from "lucide-react";
import { LogInButton } from "@/components/login-button";

export default function Layout({ children }: LayoutProps<"/">) {
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
          children: <LogInButton />,
          secondary: true,
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
