"use client";

import { arrayOfRetrievers } from "@/lib/constants";
import { handleSubmit } from "@/lib/handleSubmit";
import { getRandomSelection } from "@/lib/utils";
import {
  useAllRandomStore,
  useChatSessionsStore,
  useChosenModelStore,
  useCustomDocumentStore,
  useInProcessStore,
  useSmallScreenStore,
  useVoteStore,
} from "@/lib/zustand";
import { Message } from "ai";
import { CornerDownLeftIcon, FlipHorizontal, FlipVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { MessageDisplay } from "./message-display";
import { SelectionMenu } from "./selection-menu";

export interface ChatSession {
  chatHistory: Message[];
  retrieverSelection: string;
  loading: boolean;
}
[];

export function ChatBots() {
  const [input, setInput] = useState<string>("");
  // Initialize isSmallScreen with a default value that doesn't rely on window
  const { isSmallScreen, setIsSmallScreen } = useSmallScreenStore();

  const { chatSessions, setChatSessions } = useChatSessionsStore();
  const { setAllRandom } = useAllRandomStore();
  const { hasVoted } = useVoteStore();
  const { setInProcess } = useInProcessStore();
  const { customDocuments } = useCustomDocumentStore();

  const { chosenModel } = useChosenModelStore();

  useEffect(() => {
    // Now we can safely access window because this code runs in the browser
    setIsSmallScreen(window.innerWidth < 768);

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const submitChatSessions = async () => {
    setInProcess(true);

    const randomRetrieverSessions = chatSessions.filter(
      (session) => session.retrieverSelection === "random"
    );

    let randomRetrievers: string[] | undefined = [];
    while (randomRetrievers.length < randomRetrieverSessions.length) {
      const newRetriever = getRandomSelection(
        arrayOfRetrievers,
        randomRetrievers
      );
      if (!randomRetrievers.includes(newRetriever)) {
        randomRetrievers.push(newRetriever);
      }
    }

    const hasNonRandomSelection = chatSessions.some(
      (session) => session.retrieverSelection !== "random"
    );
    setAllRandom(!hasNonRandomSelection);

    let randomRetrieverIndex = 0;

    chatSessions.forEach((session, index) => {
      let newRetrieverSelection = session.retrieverSelection;

      if (session.retrieverSelection === "random" && randomRetrievers) {
        newRetrieverSelection = randomRetrievers[randomRetrieverIndex++];
      }

      handleSubmit({
        customDocuments,
        input,
        chatHistory: session.chatHistory,
        setChatHistory: (newHistory) => {
          setChatSessions((currentSessions: ChatSession[]) =>
            currentSessions.map((currentSession: ChatSession, idx: number) => {
              if (idx === index) {
                return {
                  ...currentSession,
                  chatHistory:
                    typeof newHistory === "function"
                      ? newHistory(currentSession.chatHistory)
                      : newHistory,
                  retrieverSelection: newRetrieverSelection,
                };
              }
              return currentSession;
            })
          );
        },
        retrieverSelection: newRetrieverSelection,
        setLoading: (isLoading) => {
          setChatSessions((currentSessions: ChatSession[]) =>
            currentSessions.map((session: ChatSession, idx: number) => {
              if (idx === index) {
                return { ...session, loading: isLoading };
              }
              return session;
            })
          );
        },
        chosenModel,
      });
    });

    setInput("");
  };

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (input.trim() === "") {
      return;
    }

    submitChatSessions();
  };

  const handleKeyDown = (e: {
    key: string;
    shiftKey: boolean;
    preventDefault: () => void;
  }) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction={"vertical"}
        className={`relative max-w-7xl m-auto 
      
      ${isSmallScreen ? "max-h-[1300px]" : "max-h-[900px]"} `}
        style={{ height: "1300px" }}
      >
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup
            direction={isSmallScreen ? "vertical" : "horizontal"}
          >
            {chatSessions.map((session, index) => (
              <React.Fragment key={index}>
                <ResizablePanel defaultSize={50} className="min-w-72 h-7xl">
                  <MessageDisplay
                    message={session.chatHistory}
                    setRetrieverSelection={(newSelection) => {
                      const updatedSessions = [...chatSessions];
                      updatedSessions[index].retrieverSelection = newSelection;
                      setChatSessions(updatedSessions);
                    }}
                    retrieverSelection={session.retrieverSelection}
                    loading={session.loading}
                    chatIndex={index}
                  />
                </ResizablePanel>
                {index < chatSessions.length - 1 && (
                  <ResizableHandle withHandle />
                )}
              </React.Fragment>
            ))}
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <SelectionMenu />
        <ResizablePanel defaultSize={25} className="min-h-24 max-h-96">
          <div className="p-4 max-w-3xl m-auto">
            <form
              onSubmit={handleFormSubmit}
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring lg:col-span-3 max-w-[800px] max-h-[140px]"
            >
              <Label className="sr-only" htmlFor="message">
                Message
              </Label>
              <Textarea
                className="min-h-20 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                placeholder={
                  customDocuments.length > 0
                    ? "Ask a question about your custom data"
                    : "Ask a question about Paul Graham's essays on startups..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={hasVoted}
              />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          isSmallScreen
                            ? setIsSmallScreen(false)
                            : setIsSmallScreen(true);
                        }}
                        size="icon"
                        className="size-4"
                        variant={"ghost"}
                        type="button"
                      >
                        {isSmallScreen ? <FlipHorizontal /> : <FlipVertical />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Change Layout</TooltipContent>
                  </Tooltip>

                  <Button
                    className="ml-auto gap-1.5"
                    size="sm"
                    type="submit"
                    disabled={hasVoted}
                  >
                    Send Message
                    <CornerDownLeftIcon className="size-3.5" />
                  </Button>
                </TooltipProvider>
              </div>
            </form>
            <span className="hover:cursor-pointer text-sm shadow-2xl mt-1 text-gray-600 flex justify-between">
              <div>
                Sourced from{" "}
                <a
                  href="https://paulgraham.com/articles.html"
                  target="_blank"
                  className="underline"
                >
                  Paul Grahams essays
                </a>
              </div>
              <div>
              Powered by{" "}
                <a
                  href="https://mendable.ai/"
                  target="_blank"
                  className="underline"
                >
                  Mendable.ai
                </a>
              </div>
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
