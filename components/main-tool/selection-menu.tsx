import {
  ArrowLeftSquare,
  ArrowRightSquare,
  Equal,
  Images,
  ListRestart,
  ThumbsDown,
  Trash2,
} from "lucide-react";

import { voteFunction } from "@/app/actions/voting-system";
import aplyToast from "@/lib/aplyToaster";
import { useInProcessStore, useVoteStore } from "@/lib/zustand";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ChatSession } from "./chatbots";

interface SelectionMenuProps {
  chatSessions: ChatSession[];
}

export function SelectionMenu({ chatSessions }: SelectionMenuProps) {
  const { setHasVoted } = useVoteStore();
  const { setInProcess } = useInProcessStore();

  let message: string[] = [];
  let retriever: any = [];
  chatSessions.forEach((session) => {
    session.chatHistory.forEach((chat) => {
      if (chat?.content && chat?.role === "assistant") {
        message.push(chat.content);
      }
    });

    retriever.push(session.retrieverSelection);
  });

  return (
    <div className="flex items-center p-2">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const response = voteFunction(retriever[0]);
                setInProcess(false);
                if (!response) {
                  aplyToast("Error voting");
                  return;
                }
                aplyToast(`Vote recorded!`);
                setHasVoted(true);
              }}
              // disabled={!message.length}
            >
              <ArrowLeftSquare className="h-4 w-4" />
              <span className="sr-only">Vote Left</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vote Left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => voteFunction(retriever[1])}
              disabled={!message.length}
            >
              <ArrowRightSquare className="h-4 w-4" />
              <span className="sr-only">Vote Right</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vote Right</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!message.length}>
              <Equal className="h-4 w-4" />
              <span className="sr-only">Tie</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tie</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!message.length}>
              <ThumbsDown className="h-4 w-4" />
              <span className="sr-only">Both are bad</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Both are bad</TooltipContent>
        </Tooltip>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!message.length}>
              <ListRestart className="h-4 w-4" />
              <span className="sr-only">New Round</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Round</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!message.length}>
              <Images className="h-4 w-4" />
              <span className="sr-only">Print Result</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print Result</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                // setRetrieverSelection("random");
                // setRetrieverSelection2("random");
              }}
              variant="ghost"
              size="icon"
              disabled={false}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Move to trash</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Move to trash</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
