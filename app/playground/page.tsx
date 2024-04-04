"use client";
import Header from "@/components/theme/header";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useSplitResultStore } from "@/lib/zustand";
import PlaygroundChat from "./components/chat";
import TextBox from "./components/text-box";
import TextSplitterBox from "./components/text-splitter-box";

export default function PlaygroundPage() {
  const { splitResult, setSplitResult } = useSplitResultStore();
  return (
    <>
      <Header />
      <div className="p-10 flex max-w-[1480px] justify-center m-auto w-full">
        <div className="grid grid-cols-6 grid-rows-2 gap-4 w-full">
          <div className="col-span-2 row-span-1">
            <TextBox />
          </div>
          <HoverBorderGradient
            containerClassName="rounded-md col-span-2 row-span-1 min-w-full"
            as="div"
            className="w-full rounded-md"
            stopAnimation={splitResult.length !== 0}
          >
            <TextSplitterBox />
          </HoverBorderGradient>
          <div className="col-span-2 row-span-2 min-h-max">
            <PlaygroundChat />
          </div>
          <div className="col-span-2 row-span-1">
            <TextSplitterBox />
          </div>

          <div className="col-span-2 row-span-1">
            <TextSplitterBox />
          </div>
        </div>
      </div>
    </>
  );
}
