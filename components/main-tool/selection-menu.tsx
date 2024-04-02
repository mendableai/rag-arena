import { ArrowLeftSquare, ArrowRightSquare, RefreshCcw } from "lucide-react";

import {
  useAllRandomStore,
  useChatSessionsStore,
  useVoteStore
} from "@/lib/zustand";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { useRefresher } from "@/lib/hooks/useRefresher";
import { useVoteHandler } from "@/lib/hooks/useVoteHandler";
import { useUser } from "@clerk/nextjs";

export function SelectionMenu() {
  const { hasVoted } = useVoteStore();
  const { allRandom } = useAllRandomStore();
  const { user } = useUser();
  const { chatSessions } = useChatSessionsStore();

  const refresh = useRefresher();

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
  
  const handleVote = useVoteHandler(retriever, allRandom, user?.username);
  return (
    <div className="relative w-full flex items-center p-2 self-center gap-2">
      <div className="w-full flex justify-center items-center gap-2 ">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-fit px-2 h-10 gap-2 items-center animate-pulse hover:bg-green-400 hover:bg-opacity-50"
              onClick={() => handleVote(0)}
              disabled={!message.length || hasVoted}
            >
              <ArrowLeftSquare className="h-4 w-4" />
              Chat 1 is better
              <span className="sr-only">Vote on Chat 1</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vote on Chat 1</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-fit px-2 h-10 gap-2 items-center animate-pulse hover:bg-green-400 hover:bg-opacity-50"
              onClick={() => refresh()}
              disabled={!message.length || hasVoted}
            >
              Tie
              <span className="sr-only">Tie</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tie</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-fit px-2 h-10 gap-2 items-center animate-pulse hover:bg-green-400 hover:bg-opacity-50"
              onClick={() => handleVote(1)}
              disabled={!message.length || hasVoted}
            >
              Chat 2 is better
              <ArrowRightSquare className="h-4 w-4" />
              <span className="sr-only">Vote Chat 2</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vote Chat 2</TooltipContent>
        </Tooltip>
      </div>
      <div className="absolute sm:right-0 flex items-center gap-2 pr-4 ml-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => refresh()}
              variant={!hasVoted ? "outline" : "default"}
              className={`${
                !hasVoted ? "" : "text-white"
              } w-fit px-2 h-10 gap-2 mt-[310px] md:mt-0`}
              size="icon"
              disabled={false}
            >
              <RefreshCcw className="h-4 w-4" />
              New Round
              <span className="sr-only">New Round</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Round</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
