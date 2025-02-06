"use client";

import { SunMoon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoutButton } from "../logout-button";

export function MainNav() {
  const title = useBreadcrumb();

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDarkMode(!isDarkMode);
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", currentTheme ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  return (
    <div className="flex w-full items-center h-[68px] p-4 border-b border-gray-200 sticky top-0 text-foreground bg-background">
      <SidebarTrigger />
      <Breadcrumb className="flex items-center ml-1.5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center">
        <span>
          Pressione{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘ J</span>
          </kbd>
          <span className="text-xs"> ou </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">Ctrl J</span>
          </kbd>{" "}
          para Pesquisar
        </span>
        <div className="ml-6">
          <Button
            className="w-[30px] h-[30px]"
            variant="ghost"
            onClick={handleToggleTheme}
          >
            <SunMoon width={30} height={30} />
          </Button>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
