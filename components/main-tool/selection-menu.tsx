import {
  ArrowLeftSquare,
  ArrowRightSquare,
  Images,
  ListRestart,
  Trash2
} from "lucide-react";

import { addTimesTestedForBoth, voteFunction } from "@/app/actions/voting-system";
import aplyToast from "@/lib/aplyToaster";
import {
  useAllRandomStore,
  useChatSessionsStore,
  useInProcessStore,
  useVoteStore,
} from "@/lib/zustand";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { retrieverInfo } from "@/lib/constants";
import { useRefresher } from "@/lib/hooks/useRefresher";

export function SelectionMenu() {
  const { hasVoted, setHasVoted } = useVoteStore();
  const { setInProcess } = useInProcessStore();
  const { allRandom } = useAllRandomStore();

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

  return (
    <div className="flex items-center p-2 self-center">
      <div className="flex items-center gap-2 ">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              onClick={async () => {
                if (hasVoted || !allRandom) return;

                const addTestCount = await addTimesTestedForBoth(retriever);
                
                if(!addTestCount){
                  aplyToast("Error adding test count");
                  return;
                }
                const response = await voteFunction(retriever[0]);
                setInProcess(false);
                if (!response) {
                  aplyToast("Error voting");
                  return;
                }
                aplyToast(
                  `Vote recorded for ${
                    retrieverInfo[retriever[0] as keyof typeof retrieverInfo]
                      ?.fullName
                  }!`
                );
                setHasVoted(true);
              }}
              disabled={!message.length || hasVoted}
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
              variant="default"
              size="icon"
              onClick={async () => {
                if (hasVoted || !allRandom) return;

                if (hasVoted || !allRandom) return;
                const addTestCount = await addTimesTestedForBoth(retriever);

                if(!addTestCount){
                  aplyToast("Error adding test count");
                  return;
                }

                const response = voteFunction(retriever[1]);
                setInProcess(false);
                if (!response) {
                  aplyToast("Error voting");
                  return;
                }
                aplyToast(
                  `Vote recorded for ${
                    retrieverInfo[retriever[1] as keyof typeof retrieverInfo]
                      ?.fullName
                  }!`
                );
                setHasVoted(true);
              }}
              disabled={!message.length || hasVoted}
            >
              <ArrowRightSquare className="h-4 w-4" />
              <span className="sr-only">Vote Right</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vote Right</TooltipContent>
        </Tooltip>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Tooltip open={hasVoted}>
          <TooltipTrigger asChild>
            <Button
              variant={!hasVoted ? "ghost" : "default"}
              size="icon"
              disabled={!hasVoted}
              onClick={() => refresh()}
              className="transition-all duration-300"
            >
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
              onClick={() => refresh()}
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
