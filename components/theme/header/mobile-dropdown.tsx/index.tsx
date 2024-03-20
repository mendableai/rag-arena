import LlmSelector from "@/components/llm-selector";
import CustomIngest from "@/components/main-tool/custom-ingest";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import ThemeToggle from "../theme-toggle";

export default function MobileDropdown({
  isHomePage,
}: {
  isHomePage: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mr-3">
        <DropdownMenuGroup className="px-4 items-center flex flex-col gap-2">
          {isHomePage && <CustomIngest />}
          {isHomePage && <LlmSelector />}
          <DropdownMenuItem>Leaderboard</DropdownMenuItem>
          <DropdownMenuItem>Opensource</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center flex-col gap-2">
            <ThemeToggle />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
