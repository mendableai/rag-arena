"use client";

import { arrayOfRetrievers } from "@/lib/constants";
import { handleSubmit } from "@/lib/handleSubmit";
import { getRandomSelection } from "@/lib/utils";
import {
  useAllRandomStore,
  useChatSessionsStore,
  useCustomDocumentStore,
  useInProcessStore,
  useVoteStore,
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
  const { hasVoted } = useVoteStore();
  const { setInProcess } = useInProcessStore();

  const { customDocuments } = useCustomDocumentStore();

  const submitChatSessions = async () => {
    setInProcess(true);

    // Determine the number of sessions that require a random retriever
    const randomRetrieverSessions = chatSessions.filter(session => session.retrieverSelection === "random");

    // Generate a list of unique random retrievers for the sessions that need them
    let randomRetrievers: string[] | undefined = [];
    while (randomRetrievers.length < randomRetrieverSessions.length) {
      const newRetriever = getRandomSelection(arrayOfRetrievers, randomRetrievers);
      if (!randomRetrievers.includes(newRetriever)) {
        randomRetrievers.push(newRetriever);
      }
    }

    // Check if at least one of the selected retrievers isn't "random"
    const hasNonRandomSelection = chatSessions.some(session => session.retrieverSelection !== "random");
    setAllRandom(!hasNonRandomSelection);

    // Keep track of how many random retrievers have been assigned
    let randomRetrieverIndex = 0;

    chatSessions.forEach((session, index) => {
      let newRetrieverSelection = session.retrieverSelection;

      // Assign a unique random retriever if needed
      if (session.retrieverSelection === "random") {
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
      });
    });

    setInput("");
  };

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
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
                <Button
                  size="sm"
                  className="ml-auto text-white"
                  disabled={hasVoted}
                >
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
