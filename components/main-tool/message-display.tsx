import { useChatSessionsStore } from "@/lib/zustand";
import { Message } from "ai";
import React, { useEffect, useRef, useState } from "react";
import { SelectRetrieverMenu } from "./select-retriever-menu";

interface MessageDisplayProps {
  message: Message[];
  setRetrieverSelection: (value: string) => void;
  retrieverSelection: string;
  loading: boolean;
  chatIndex?: number;
}

const MessageDisplay: React.FC<MessageDisplayProps> = React.memo(
  ({
    message,
    setRetrieverSelection,
    retrieverSelection,
    loading,
    chatIndex,
  }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [expandedSources, setExpandedSources] = useState<{ [key: string]: boolean }>({});

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
        className={`flex h-full flex-col overflow-y-scroll
    
       ${loading && "hover:animate-pulse"}`}
      >
        <SelectRetrieverMenu
          setRetrieverSelection={setRetrieverSelection}
          retrieverSelection={retrieverSelection}
          chatIndex={chatIndex}
        />

        <div className="flex flex-1 flex-col">
          <div
            ref={scrollContainerRef}
            className="flex-1 whitespace-pre-wrap p-4 text-sm gap-6 flex flex-col"
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
                  {m.annotations && m.annotations.length ? (
                    <div className=" mt-2 dark:bg-slate-900 bg-slate-100 px-3 py-2 drop-shadow-lg rounded-md">
                      <span>🔍 Chunks Retrieved:</span>
                      <span className="mt-1 mr-2 px-2 py-1 rounded text-xs">
                        {m.annotations?.map((source: any, i) => {
                          
                          const indexKey = `source:${i}`;
                          const isExpanded = expandedSources[indexKey];
                          const toggleExpand = () => setExpandedSources(prevState => ({
                            ...prevState,
                            [indexKey]: !prevState[indexKey],
                          }));
                          const contentPreview = source.pageContent.slice(0, 100).replace(/\n/g, ' ');
                          const isContentLong = source.pageContent.length > 100;

                          return (
                            <div className="mt-10" key={indexKey}>
                              {i + 1}. &quot;
                              {isExpanded ? (
                                <span dangerouslySetInnerHTML={{ __html: source.pageContent.replace(/\n/g, ' ') }} />
                              ) : (
                                `${contentPreview}${isContentLong ? '...' : ''}`
                              )} &quot;
                              {isContentLong && (
                                <button
                                  onClick={() => toggleExpand()}
                                  className="ml-2 text-white font-semibold text-[11px]"
                                >
                                  {isExpanded ? 'Show Less' : 'Show More'}
                                </button>
                              )}
                              {source.metadata.title !== undefined ? (
                                <div className="mt-1 flex flex-col">
                                  <a
                                    href={source.metadata.link}
                                    target="_blank"
                                    className="text-primary"
                                  >
                                    Link to source: ({source.metadata.title})
                                  </a>
                                  <span>
                                    from line: {source.metadata.from_line} to
                                    line: {source.metadata.to_line}
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                              <span className="float-right text-primary">
                               Relevance Score:{" "}
                                {(
                                  parseFloat(source.metadata.relevanceScore) * 100
                                ).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <p className="mt-4">{m.content}</p>
                </div>
                <div className="text-xs text-muted-foreground min-w-20 text-right">
                  {m?.createdAt?.toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div />
          </div>
        </div>
      </div>
    );
  }
);

MessageDisplay.displayName = "MessageDisplay";

export { MessageDisplay };

