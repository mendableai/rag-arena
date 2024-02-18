"use client";

import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-20 items-center justify-between px-4 xl:px-60">
        <div className="hidden lg:block">
          <Link
            href={"https://github.com/Kiranism/next-shadcn-dashboard-starter"}
            target="_blank"
          >
            <Logo />
          </Link>
        </div>
      

        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Avatar />
        </div>
      </nav>
    </div>
  );
}
