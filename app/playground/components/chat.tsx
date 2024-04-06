"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { JSONValue, Message } from "ai";
import { useChat } from "ai/react";
import { CornerDownLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useCustomPlaygroundChunksStore,
  useInMemoryStore,
  useSelectedPlaygroundLlmStore,
  useSelectedPlaygroundRetrieverStore,
  useSelectedVectorStore,
} from "../lib/globals";
import { PlaygroundMessageDisplay } from "./chat-messages";

export default function PlaygroundChat() {
  const { selectedPlaygroundLlm } = useSelectedPlaygroundLlmStore();
  const { inMemory } = useInMemoryStore();
  const { selectedVectorStore } = useSelectedVectorStore();
  const { customPlaygroundChunks } = useCustomPlaygroundChunksStore();
  const { selectedPlaygroundRetriever } = useSelectedPlaygroundRetrieverStore();

  const [messagesHistoryWithSource, setMessagesHistoryWithSource] = useState<
    Message[]
  >([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    api: "/api/playground/chat",
    body: {
      selectedPlaygroundLlm,
      inMemory,
      selectedVectorStore,
      customPlaygroundChunks,
      selectedPlaygroundRetriever,
    },
    onFinish: () => {
      if (data) {
        processSources(data);
      }
    },
  });

  const processSources = (data: JSONValue[] | undefined) => {
    const sources = data?.flatMap((annotation: any) =>
      JSON.parse(atob(annotation)).map((item: any) => item)
    );

    setMessagesHistoryWithSource((prev: Message[]) => {
      if (prev.length === 0) {
        return prev;
      }
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = {
        ...newMessages[newMessages.length - 1],
        annotations: sources,
      };
      return newMessages;
    });
  };

  useEffect(() => {
    if (data && messagesHistoryWithSource.length === 2) {
      processSources(data);
    }

    setMessagesHistoryWithSource((prevMessages) => {
      const prevMessagesMap = new Map(prevMessages.map((msg) => [msg.id, msg]));

      const updatedMessages = messages.map((newMsg) => {
        const existingMsg = prevMessagesMap.get(newMsg.id);
        return existingMsg ? { ...existingMsg, ...newMsg } : newMsg;
      });

      return updatedMessages;
    });
  }, [messages]);

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 max-h-[400px]">
        <PlaygroundMessageDisplay
          message={messagesHistoryWithSource}
          loading={false}
          annotations={data}
        />
      </CardContent>
      <CardFooter className="self-end w-full">
        <div className="p-4 w-full m-auto">
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring lg:col-span-3 max-w-[800px] max-h-[140px]"
          >
            <Label className="sr-only" htmlFor="message">
              Message
            </Label>
            <Textarea
              className="min-h-20 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              placeholder={"Ask a question about your custom data"}
              value={input}
              onChange={handleInputChange}
            />
            <div className="flex items-center p-3 pt-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="size-4"
                      variant={"ghost"}
                      type="button"
                    ></Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Change Layout</TooltipContent>
                </Tooltip>

                <Button
                  className="ml-auto gap-1.5"
                  size="sm"
                  type="submit"
                  disabled={
                    selectedPlaygroundLlm === "" ||
                    selectedPlaygroundRetriever === "" ||
                    (selectedVectorStore === "" && !inMemory)
                    
                  }
                >
                  Send Message
                  <CornerDownLeftIcon className="size-3.5" />
                </Button>
              </TooltipProvider>
            </div>
          </form>
          <span className="hover:cursor-pointer text-[10px] shadow-2xl mt-1 text-gray-600 flex justify-between">
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
            <div className="text-right">
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
      </CardFooter>
    </Card>
  );
}
