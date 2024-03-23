"use client";

import { ChatBots } from "@/components/main-tool";
import Header from "@/components/theme/header";
import InitialPopUp from "@/components/theme/initial-pop-up";
import { queryClient } from "@/lib/queryClient";
import { useSmallScreenStore } from "@/lib/zustand";
import { QueryClientProvider } from "react-query";

export default function Main() {
  const { isSmallScreen } = useSmallScreenStore();

  return (
    <>
      <QueryClientProvider client={queryClient}>
      <Header />
        <div
          className={`${
            isSmallScreen ? "md:h-[850px]" : "md:h-[750px]"
          } max-w-7xl border m-auto mt-20`}
        >
          <ChatBots />
          <InitialPopUp />
        </div>
      </QueryClientProvider>
    </>
  );
}
