"use client";

import { Message } from "ai";
import { useState } from "react";
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

import { handleSubmit } from "@/lib/handleSubmit";
import { getRandomSelection } from "@/lib/utils";
import { arrayOfRetrievers } from "./select-retriever-menu";

export function ChatBots() {
  const [input, setInput] = useState<string>("");

  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [chatHistory2, setChatHistory2] = useState<Message[]>([]);

  const [retrieverSelection, setRetrieverSelection] =
    useState<string>("random");
  const [retrieverSelection2, setRetrieverSelection2] =
    useState<string>("random");

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    let newRetrieverSelection = retrieverSelection;
    let newRetrieverSelection2 = retrieverSelection2;

    if (retrieverSelection === "random") {
      newRetrieverSelection = getRandomSelection(arrayOfRetrievers);
    }
    if (retrieverSelection2 === "random") {
      newRetrieverSelection2 = getRandomSelection(
        arrayOfRetrievers,
        newRetrieverSelection
      );
    }

    setRetrieverSelection(newRetrieverSelection);
    setRetrieverSelection2(newRetrieverSelection2);

    handleSubmit({
      input,
      chatHistory,
      setChatHistory,
      retrieverSelection: newRetrieverSelection,
    });
    handleSubmit({
      input,
      chatHistory: chatHistory2,
      setChatHistory: setChatHistory2,
      retrieverSelection: newRetrieverSelection2,
    });

    setInput("");
  };

  const handleKeyDown = (e: {
    key: string;
    shiftKey: any;
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
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50} className="min-w-72">
              <MessageDisplay
                message={chatHistory}
                setRetrieverSelection={setRetrieverSelection}
                retrieverSelection={retrieverSelection}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} className="min-w-72">
              <MessageDisplay
                message={chatHistory2}
                setRetrieverSelection={setRetrieverSelection2}
                retrieverSelection={retrieverSelection2}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} className="min-h-40 max-h-96">
          <SelectionMenu
            message={chatHistory}
            setRetrieverSelection={setRetrieverSelection}
            setRetrieverSelection2={setRetrieverSelection2}
          />
          <div className="p-4 max-w-3xl m-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit(e);
              }}
            >
              <div className="gap-4 flex items-center">
                <Textarea
                  className="p-4"
                  placeholder={`Reply...`}
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
