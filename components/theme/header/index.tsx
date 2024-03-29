"use client";

import LlmSelector from "@/components/llm-selector";
import CustomIngest from "@/components/main-tool/custom-ingest";
import { Button } from "@/components/ui/button";
import { useSmallScreenStore } from "@/lib/zustand";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Home, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./logo";
import MobileDropdown from "./mobile-dropdown.tsx";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    setIsHomePage(window.location.pathname === "/");
  }, []);

  const redirectTo = isHomePage ? "/leaderboard" : "/";

  const { isSmallScreen } = useSmallScreenStore();

  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-20 items-center justify-between px-4 xl:px-60">
        <div className="lg:block">
          <Link href={"/"}>
            <Logo />
          </Link>
        </div>

        {isSmallScreen ? (
          <MobileDropdown isHomePage={isHomePage} />
        ) : (
          <div className="flex items-center gap-4">
            {isHomePage && <LlmSelector />}

            {isHomePage && <CustomIngest />}

            <a href={redirectTo}>
              <Button variant="outline" size="icon" disabled={false}>
                {isHomePage ? (
                  <Trophy className="h-4 w-4" />
                ) : (
                  <Home className="h-4 w-4" />
                )}
              </Button>
            </a>

            <ThemeToggle />
            <a href="https://github.com/mendableai/rag-arena">
              <Button variant="outline" size="icon" disabled={false}>
                <GitHubLogoIcon className="h-4 w-4" />
              </Button>
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}
