"use client";

import { arrayOfRetrievers } from "@/lib/constants";
import { handleSubmit } from "@/lib/handleSubmit";
import { getRandomSelection } from "@/lib/utils";
import {
  useAllRandomStore,
  useChatSessionsStore,
  useInProcessStore,
} from "@/lib/zustand";
import { Message } from "ai";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Textarea } from "../ui/textarea";
import { TooltipProvider } from "../ui/tooltip";
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
  const { chatSessions, setChatSessions } = useChatSessionsStore();

  const { setAllRandom } = useAllRandomStore();

  const { setInProcess } = useInProcessStore();

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setInProcess(true);

    const alreadySelectedRetrievers = chatSessions.map(
      (session) => session.retrieverSelection
    );
    chatSessions.forEach((session, index) => {
      let excludeList = alreadySelectedRetrievers.filter(
        (_, idx) => idx !== index
      );

      if (session.retrieverSelection !== "random") {
        setAllRandom(false);
      }

      let newRetrieverSelection =
        session.retrieverSelection === "random"
          ? getRandomSelection(arrayOfRetrievers, excludeList)
          : session.retrieverSelection;

      handleSubmit({
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
      });
    });

    setInput("");
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
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="horizontal">
            {chatSessions.map((session, index) => (
              <React.Fragment key={index}>
                <ResizablePanel defaultSize={50} className="min-w-72">
                  <MessageDisplay
                    message={session.chatHistory}
                    setRetrieverSelection={(newSelection) => {
                      const updatedSessions = [...chatSessions];
                      updatedSessions[index].retrieverSelection = newSelection;
                      setChatSessions(updatedSessions);
                    }}
                    retrieverSelection={session.retrieverSelection}
                    loading={session.loading}
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
        <ResizablePanel defaultSize={20} className="min-h-40 max-h-96">
          <div className="p-4 max-w-3xl m-auto">
            <form onSubmit={handleFormSubmit}>
              <div className="gap-4 flex items-center">
                <Textarea
                  className="p-4"
                  placeholder="Reply..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button size="sm" className="ml-auto">
                  Send
                </Button>
              </div>
            </form>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
