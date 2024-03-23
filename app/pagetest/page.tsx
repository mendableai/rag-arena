"use client";

import { ChatBots } from "@/components/main-tool";
import Header from "@/components/theme/header";
import LeftMenu from "@/components/theme/left-menu";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "react-query";

export default function Component() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid min-h-[calc(100vh-7.0rem)] w-full pl-[53px]">
        <LeftMenu />
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[53px] gap-1 border-b bg-background px-4 justify-between items-center">
            <Header />
          </header>
          <main className="flex-1 gap-4 p-4">
            <ChatBots />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
