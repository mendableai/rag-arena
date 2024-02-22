import { Message } from "ai";
import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
      <div className="flex h-full flex-col">
        <SelectRetrieverMenu
          setRetrieverSelection={setRetrieverSelection}
          retrieverSelection={retrieverSelection}
        />
        <Separator />

        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage />
                <AvatarFallback>LM</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">Retriever Name</div>
                <div className="line-clamp-1 text-xs">
                  Retriever description
                </div>
              </div>
            </div>

            <div className="ml-auto text-xs text-muted-foreground">
              Learn more..
            </div>
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm max-h-[400px] overflow-y-scroll gap-6 flex flex-col">
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
            <div ref={messagesEndRef} />
          </div>
          <Separator className="mt-auto" />
        </div>
      </div>
    );
  }
);

MessageDisplay.displayName = "MessageDisplay";

export { MessageDisplay };

