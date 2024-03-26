"use client";

import LlmSelector from "@/components/llm-selector";
import CustomIngest from "@/components/main-tool/custom-ingest";
import { Button } from "@/components/ui/button";
import { useSmallScreenStore } from "@/lib/zustand";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation.js";
import { useQuery } from "react-query";
import MobileDropdown from "./mobile-dropdown.tsx";

export default function MainNavbar() {
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

  const { isSmallScreen } = useSmallScreenStore();
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  return (
    <>
      <div className="lg:block">
        {isHomePage && (
          <h1 className="text-lg font-semibold">Retriever Arena</h1>
        )}
        {pathname === "/leaderboard" && (
          <h1 className="text-lg font-semibold">Leaderboard</h1>
        )}
        {pathname === "/voters" && (
          <h1 className="text-lg font-semibold">Top Voters by Github Username</h1>
        )}
      </div>

      {isSmallScreen ? (
        <MobileDropdown isHomePage={isHomePage} />
      ) : (
        <div className="flex items-center gap-4">
          {isHomePage && <LlmSelector />}

          {isHomePage && <CustomIngest />}

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
