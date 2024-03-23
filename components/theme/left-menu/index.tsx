import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookIcon, BotIcon, Code2Icon, LifeBuoyIcon, Settings2Icon, TerminalSquareIcon, TriangleIcon, UserSquareIcon } from "lucide-react";

export default function LeftMenu() {
  return (
    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2">
        <Button aria-label="Home" size="icon" variant="outline">
          <TriangleIcon className="size-5 fill-foreground" />
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Playground"
                className="rounded-lg bg-muted"
                size="icon"
                variant="ghost"
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
              <Button
                aria-label="Models"
                className="rounded-lg"
                size="icon"
                variant="ghost"
              >
                <BotIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Models
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="API"
                className="rounded-lg"
                size="icon"
                variant="ghost"
              >
                <Code2Icon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              API
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Documentation"
                className="rounded-lg"
                size="icon"
                variant="ghost"
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
                className="rounded-lg"
                size="icon"
                variant="ghost"
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Help"
                className="mt-auto rounded-lg"
                size="icon"
                variant="ghost"
              >
                <LifeBuoyIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Help
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Account"
                className="mt-auto rounded-lg"
                size="icon"
                variant="ghost"
              >
                <UserSquareIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Account
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
