"use client";
import Header from "@/components/theme/header";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import PlaygroundChat from "./components/chat";
import LlmSelectorBox from "./components/llm-selector-box";
import RetrieverSelectorBox from "./components/retriever-selector-box";
import TextSplitterBox from "./components/text-splitter-box";
import VectorStoreBox from "./components/vector-store-box";
import {
  useCustomPlaygroundChunksStore,
  useSelectedPlaygroundLlmStore,
  useSelectedPlaygroundRetrieverStore,
  useSelectedVectorStore
} from "./lib/globals";

export default function PlaygroundPage() {
  const { customPlaygroundChunks } = useCustomPlaygroundChunksStore();
  const { selectedPlaygroundLlm } = useSelectedPlaygroundLlmStore();
  const { selectedPlaygroundRetriever } = useSelectedPlaygroundRetrieverStore();
  const { selectedVectorStore } = useSelectedVectorStore();

  return (
    <>
      <Header />
      <div className="p-10 flex max-w-[1480px] justify-center m-auto w-full">
        <div className="grid grid-cols-6 grid-rows-2 gap-4 w-full">
          <HoverBorderGradient
            containerClassName="rounded-md col-span-2 row-span-1 min-w-full"
            as="div"
            className="w-full rounded-md h-full"
            stopAnimation={customPlaygroundChunks.length !== 0}
            withHighlight={customPlaygroundChunks.length === 0}
            duration={3}
          >
            <TextSplitterBox />
          </HoverBorderGradient>

          <HoverBorderGradient
            containerClassName="rounded-md col-span-2 row-span-1 min-w-full"
            as="div"
            className="w-full rounded-md h-full"
            stopAnimation={selectedVectorStore !== ""}
            duration={3}
          >
            <VectorStoreBox />
          </HoverBorderGradient>

          <div className="col-span-2 row-span-2 min-h-max">
            <PlaygroundChat />
          </div>

          <HoverBorderGradient
            containerClassName="rounded-md col-span-2 row-span-1 min-w-full"
            as="div"
            className="w-full rounded-md h-[220px]"
            stopAnimation={selectedPlaygroundRetriever !== ""}
            duration={3}
          >
            <RetrieverSelectorBox />
          </HoverBorderGradient>

          <HoverBorderGradient
            containerClassName="rounded-md col-span-2 row-span-1 min-w-full"
            as="div"
            className="w-full rounded-md h-[220px]"
            stopAnimation={selectedPlaygroundLlm !== ""}
            duration={3}
          >
            <LlmSelectorBox />
          </HoverBorderGradient>
        </div>
      </div>
    </>
  );
}
