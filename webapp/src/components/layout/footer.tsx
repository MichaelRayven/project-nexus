import { Logo } from "@/components/logo";
import Link from "next/link";
import { Container } from "../ui/layout/container";
import { GridContainer } from "../ui/layout/grid-container";

type FooterItem = {
  name: string;
  children: {
    url: string;
    name: string;
  }[];
};

export function Footer({ items }: { items: FooterItem[] }) {
  return (
    <footer className="w-full border-t bg-muted/30">
      <Container className="py-16">
        <GridContainer>
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Объединяем студентов, организуя совместный учебный процесс.
            </p>
          </div>

          {items.map((item, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{item.name}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {item.children.map((child, index) => (
                  <li key={index}>
                    <a
                      href={child.url}
                      className="hover:text-foreground transition-colors"
                    >
                      {child.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </GridContainer>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>{"© 2025 Nexus. Built for collaborative learning."}</p>
        </div>
      </Container>
    </footer>
  );
}
