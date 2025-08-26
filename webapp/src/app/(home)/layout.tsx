import { HomeLayout } from "@/components/layout/home";
import { baseOptions } from "@/lib/layout.shared";
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from "fumadocs-ui/layouts/home/navbar";
import { BookIcon } from "lucide-react";

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
      ]}
    >
      {children}
    </HomeLayout>
  );
}
