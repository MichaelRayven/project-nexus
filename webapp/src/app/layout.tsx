import "@/app/global.css";
import { Toaster } from "@/components/ui/sonner";
import { i18n } from "@/lib/i18n";
import { TRPCReactProvider } from "@/trpc/client";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    ru: {
      displayName: "Russian",
      search: "Поиск",
      searchNoResult: "Ничего не найдено",
      nextPage: "Следующая страница",
      previousPage: "Предыдущая страница",
      toc: "Содержание",
    },
  },
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <TRPCReactProvider>
      <html lang="en" className={inter.className} suppressHydrationWarning>
        <body className="flex flex-col min-h-screen">
          <RootProvider i18n={provider("ru")}>{children}</RootProvider>
          <Toaster />
        </body>
      </html>
    </TRPCReactProvider>
  );
}
