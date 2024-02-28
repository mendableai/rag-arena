"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect } from "react";

type CompProps = object;
export default function ThemeToggle({}: CompProps) {
  const setTheme = (theme: string) => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem("retrieval-arena-theme", theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("retrieval-arena-theme") ?? "light";
    setTheme(savedTheme);
  }, []);

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          document.documentElement.classList.contains("dark")
            ? setTheme("light")
            : setTheme("dark")
        }
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
