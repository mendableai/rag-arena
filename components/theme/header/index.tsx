"use client";

import { Button } from "@/components/ui/button";
import { Home, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    setIsHomePage(window.location.pathname === "/");
  }, []);

  const redirectTo = isHomePage ? "/leaderboard" : "/";

  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-20 items-center justify-between px-4 xl:px-60">
        <div className="hidden lg:block">
          <Link href={"/"}>
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <a
            href={redirectTo}
          >
            <Button variant="outline" size="icon" disabled={false}>
              {isHomePage ? (
                <Trophy className="h-4 w-4" />
              ) : (
                <Home className="h-4 w-4" />
              )}
            </Button>
          </a>

          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
