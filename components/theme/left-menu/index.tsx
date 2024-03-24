import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookIcon,
  CircleUser,
  Settings2Icon,
  Swords,
  TerminalSquareIcon,
  Trophy,
} from "lucide-react";
import Image from "next/image";
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
              <Button
                aria-label="Arena"
                className={`rounded-lg ${isActive("/") ? "bg-muted" : ""}`}
                size="icon"
                variant="ghost"
                disabled={isActive("/")}
              >
                <Swords className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Arena
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
                disabled={isActive("/playground")}
              >
                <TerminalSquareIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Playground
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="/leaderboard">
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
              </a>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Leaderboard
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Documentation"
                className={`rounded-lg ${
                  isActive("/documentation") ? "bg-muted" : ""
                }`}
                size="icon"
                variant="ghost"
                disabled={isActive("/documentation")}
              >
                <BookIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Documentation
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Settings"
                className={`rounded-lg ${
                  isActive("/settings") ? "bg-muted" : ""
                }`}
                size="icon"
                variant="ghost"
                disabled={isActive("/settings")}
              >
                <Settings2Icon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Settings
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
