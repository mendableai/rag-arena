import { Message } from "ai";
import React, { useEffect, useRef } from "react";
import { Separator } from "../ui/separator";
import { SelectRetrieverMenu } from "./select-retriever-menu";

interface MessageDisplayProps {
  message: Message[];
  setRetrieverSelection: (value: string) => void;
  retrieverSelection: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = React.memo(
  ({ message, setRetrieverSelection, retrieverSelection }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        scrollContainerRef.current.scrollTo({
          top: scrollHeight - clientHeight,
          behavior: "smooth",
        });
      }
    }, [message]);


    return (
      <div className={`flex h-full flex-col
      ${message.length>0 && "hover:border-yellow-200 hover:border-2 cursor-pointer hover:animate-pulse ease-linear transition-all duration-100"}
      `}>
        <SelectRetrieverMenu
          setRetrieverSelection={setRetrieverSelection}
          retrieverSelection={retrieverSelection}
        />
        <Separator />

        <div className="flex flex-1 flex-col">
          <Separator />
          <div ref={scrollContainerRef} className="flex-1 whitespace-pre-wrap p-4 text-sm max-h-[400px] overflow-y-scroll gap-6 flex flex-col">
            {message.length > 0
              ? message.map((m) => (
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
                                    - (Lines {source.metadata?.loc?.lines?.from}{" "}
                                    to {source.metadata?.loc?.lines?.to})
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
                ))
              : null}
            <div/>
          </div>
          <Separator className="mt-auto" />
        </div>
      </div>
    );
  }
);

MessageDisplay.displayName = "MessageDisplay";

export { MessageDisplay };

