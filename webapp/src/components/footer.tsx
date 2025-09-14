import { Logo } from "@/components/logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Connecting students through collaborative learning. Build better
              solutions together with GitHub-powered workflows.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Платформа</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Возможности
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Рабочий процесс
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Сотрудничество
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Документация
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Поддержка</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Центр помощи
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Сообщество
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Контакты
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Статус
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>{"© 2025 Nexus. Built for collaborative learning."}</p>
        </div>
      </div>
    </footer>
  );
}
