"use client";

import LlmSelector from "@/components/llm-selector";
import CustomIngest from "@/components/main-tool/custom-ingest";
import { Button } from "@/components/ui/button";
import { useSmallScreenStore } from "@/lib/zustand";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Home, Trophy } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { Logo } from "./logo";
import MobileDropdown from "./mobile-dropdown.tsx";

export default function Header() {
  const [isHomePage, setIsHomePage] = useState(false);

  const {
    data: stargazersCount,
    isLoading,
    error,
  } = useQuery(
    "stargazers",
    () =>
      fetch("/api/github")
        .then((res) => res.json())
        .then((data) => data.stargazers_count),
    {
      refetchInterval: 1000 * 60 * 60,
    }
  );

  const redirectTo = isHomePage ? "/leaderboard" : "/";

  const { isSmallScreen } = useSmallScreenStore();

  return (
    <>
      <div className="lg:block">
        <a href={"/"}>
          <Logo />
        </a>
      </div>

      {isSmallScreen ? (
        <MobileDropdown isHomePage={isHomePage} />
      ) : (
        <div className="flex items-center gap-4">
          <LlmSelector />

          <CustomIngest />

          <a href={redirectTo}>
            <Button variant="outline" size="icon" disabled={false}>
              {isHomePage ? (
                <Trophy className="h-4 w-4" />
              ) : (
                <Home className="h-4 w-4" />
              )}
            </Button>
          </a>

          
          <a href="https://github.com/mendableai/rag-arena" target="_BLANK">
            <Button
              variant="outline"
              size="icon"
              disabled={false}
              className="px-2 w-16"
            >
              <GitHubLogoIcon className="h-4 w-4 mr-2" /> {stargazersCount}
            </Button>
          </a>
        </div>
      )}
    </>
  );
}
