"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleUser, Swords, TerminalSquareIcon, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../header/theme-toggle";

export default function LeftMenu() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2">
        <Button aria-label="Home" size="icon" variant="ghost">
          <Image
            src="/logo.png"
            alt="blah"
            width={200}
            height={200}
            className="rounded-md"
          ></Image>
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/" passHref>
              <Button
                aria-label="Arena"
                className={`rounded-lg ${isActive("/") ? "bg-muted" : ""}`}
                size="icon"
                variant="ghost"
                disabled={isActive("/")}
              >
                <Swords className="size-5" />
              </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Arena
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/leaderboard" passHref>
                <Button
                  aria-label="Leaderboard"
                  className={`rounded-lg ${
                    isActive("/leaderboard") ? "bg-muted" : ""
                  }`}
                  size="icon"
                  variant="ghost"
                  disabled={isActive("/leaderboard")}
                >
                  <Trophy className="size-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Leaderboard
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Playground"
                className={`rounded-lg ${
                  isActive("/playground") ? "bg-muted" : ""
                }`}
                size="icon"
                variant="ghost"
                disabled
              >
                <TerminalSquareIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Playground
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <TooltipProvider>
          <ThemeToggle />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Account"
                className={`mt-auto rounded-lg ${
                  isActive("/account") ? "bg-muted" : ""
                }`}
                size="icon"
                variant="ghost"
                disabled={isActive("/account")}
              >
                <CircleUser className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
