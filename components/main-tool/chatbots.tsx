"use client";

import { handleSubmit } from "@/lib/handleSubmit";
import { Message } from "ai";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { TooltipProvider } from "../ui/tooltip";
import { MessageDisplay } from "./message-display";
import { SelectionMenu } from "./selection-menu";

export function ChatBots() {
  const [input, setInput] = useState<string>("");

  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [chatHistory2, setChatHistory2] = useState<Message[]>([]);

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    handleSubmit({ input, chatHistory, setChatHistory });
    handleSubmit({
      input,
      chatHistory: chatHistory2,
      setChatHistory: setChatHistory2,
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
            <ResizablePanel defaultSize={50}>
              <MessageDisplay message={chatHistory} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <MessageDisplay message={chatHistory2} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          <SelectionMenu message={chatHistory} />
          <div className="p-4 max-w-3xl m-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit({ input, chatHistory, setChatHistory });
                handleSubmit({
                  input,
                  chatHistory: chatHistory2,
                  setChatHistory: setChatHistory2,
                });
              }}
            >
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  placeholder={`Reply...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex items-center">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> Mute this
                    thread
                  </Label>
                  <Button size="sm" className="ml-auto">
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
