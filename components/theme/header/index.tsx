"use client";

import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "react-query";
import MainNavbar from "./main-navbar";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-[53px] gap-1 border-b bg-background px-4 justify-between items-center">
      <QueryClientProvider client={queryClient}>
        <MainNavbar />
      </QueryClientProvider>
    </header>
  );
}
