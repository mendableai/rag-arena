import {
  addTimesTestedForBoth,
  voteFunction,
} from "@/app/actions/voting-system";
import aplyToast from "@/lib/aplyToaster";
import { retrieverInfo } from "@/lib/constants";
import {
  useAllRandomStore,
  useChatSessionsStore,
  useInProcessStore,
  useVoteStore,
} from "@/lib/zustand";
import { Message } from "ai";
import React, { useEffect, useRef } from "react";
import { Separator } from "../ui/separator";
import { SelectRetrieverMenu } from "./select-retriever-menu";

interface MessageDisplayProps {
  message: Message[];
  setRetrieverSelection: (value: string) => void;
  retrieverSelection: string;
  loading: boolean;
}

const MessageDisplay: React.FC<MessageDisplayProps> = React.memo(
  ({ message, setRetrieverSelection, retrieverSelection, loading }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { inProcess, setInProcess } = useInProcessStore();
    const { hasVoted, setHasVoted } = useVoteStore();
    const { allRandom } = useAllRandomStore();

    useEffect(() => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        scrollContainerRef.current.scrollTo({
          top: scrollHeight - clientHeight,
          behavior: "smooth",
        });
      }
    }, [message]);

    const { chatSessions } = useChatSessionsStore();

    let retriever: any = [];
    chatSessions.forEach((session) => {
      retriever.push(session.retrieverSelection);
    });

    return (
      <div
        className={`flex h-full flex-col
      ${
        message.length > 0 &&
        inProcess &&
        allRandom &&
        !loading &&
        "hover:border-yellow-200 cursor-pointer ease-linear transition-all duration-100 hover:bg-green-400 hover:bg-opacity-50"
      }
       ${loading && "hover:animate-pulse"}`}
        onClick={async () => {
          if (hasVoted || message.length === 0 || !allRandom || loading) return;

          console.log(retriever);
          
          const addTestCount = await addTimesTestedForBoth(retriever);
          console.log(addTestCount);
          
          if (!addTestCount) {
            aplyToast("Error adding test count");
            return;
          }

          const response = voteFunction(retrieverSelection);
          setInProcess(false);
          if (!response) {
            aplyToast("Error voting");
            return;
          }
          aplyToast(
            `Vote recorded for ${
              retrieverInfo[retrieverSelection as keyof typeof retrieverInfo]
                ?.fullName
            }!`
          );
          setHasVoted(true);
        }}
      >
        <SelectRetrieverMenu
          setRetrieverSelection={setRetrieverSelection}
          retrieverSelection={retrieverSelection}
        />
        <Separator />

        <div className="flex flex-1 flex-col">
          <Separator />
          <div
            ref={scrollContainerRef}
            className="flex-1 whitespace-pre-wrap p-4 text-sm max-h-[350px] overflow-y-scroll gap-6 flex flex-col"
          >
            {message.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-between"
                }`}
              >
                <div
                  className={`whitespace-pre-wrap max-w-96 min-w-40 ${
                    m.role !== "user" ? "text-left" : "text-right"
                  }`}
                >
                  <strong>{m.role === "user" ? "" : "AI: "}</strong>
                  {m.content}
                  {m.annotations && m.annotations.length ? (
                    <div className="ml-4 mt-2 dark:bg-slate-900 bg-slate-100 px-4 py-2 drop-shadow-lg">
                      <span>🔍 Sources:</span>
                      <span className="mt-1 mr-2 px-2 py-1 rounded text-xs">
                        {m.annotations?.map((source: any, i) => (
                          <div className="mt-3" key={"source:" + i}>
                            {i + 1}. &quot;{source.pageContent}&quot;
                            {source.metadata?.loc?.lines !== undefined ? (
                              <div className="mt-1">
                                - (Lines {source.metadata?.loc?.lines?.from} to{" "}
                                {source.metadata?.loc?.lines?.to})
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ))}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="text-xs text-muted-foreground min-w-20 text-right">
                  {m?.createdAt?.toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div />
          </div>
          <Separator className="mt-auto" />
        </div>
      </div>
    );
  }
);

MessageDisplay.displayName = "MessageDisplay";

export { MessageDisplay };

