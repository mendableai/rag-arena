"use client";

import { Message } from "ai";
import { FormEvent, useEffect, useState } from "react";
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

export function ChatBots() {
  const [input, setInput] = useState<string>("");
  const [openAIResponse, setOpenAIResponse] = useState<string>("");

  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newUserEntry: Message = {
      id: `${Math.random().toString(36).substring(7)}`,
      role: "user",
      content: input,
      createdAt: new Date(),
    };

    const newChatHistory = [...chatHistory, newUserEntry];

    setChatHistory(newChatHistory);

    let receivedContent = "";

    await fetch("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newChatHistory,
      }),
    }).then(async (response: any) => {
      const reader = response.body?.getReader();

      const aiMessageId = `${Math.random().toString(36).substring(7)}`;

      const newAiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };

      setChatHistory((prev) => [...prev, newAiMessage]);

      while (true) {
        const { done, value } = await reader?.read();
        if (done) break;
        receivedContent += new TextDecoder().decode(value);
        setOpenAIResponse(receivedContent);

        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: receivedContent } : msg
          )
        );
      }
    });
  }

  useEffect(() => {
    console.log("openAIResponse: ", openAIResponse);
  }, [openAIResponse]);

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
              {/* <MessageDisplay id={"2"} /> */}
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          {/* <SelectionMenu message={messages} /> */}
          <div className="p-4 max-w-3xl m-auto">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  placeholder={`Reply...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
