import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { BookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          children: <Button>Login</Button>,
          secondary: true,
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
