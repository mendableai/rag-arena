import {
  ArrowLeftSquare,
  ArrowRightSquare,
  RefreshCcw
} from "lucide-react";

import {
  addTimesTestedForBoth,
  voteFunction,
} from "@/app/actions/voting-system";
import aplyToast from "@/lib/aplyToaster";
import {
  useAllRandomStore,
  useChatSessionsStore,
  useInProcessStore,
  useVoteStore,
} from "@/lib/zustand";
import { Button } from "../ui/button";
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
    <div className="relative w-full flex items-center p-2 self-center gap-2">
      <div className="w-full flex justify-center items-center gap-2 ">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-fit px-2 h-10 gap-2 items-center"
              onClick={async () => {
                if (hasVoted || !allRandom) return;

                const addTestCount = await addTimesTestedForBoth(retriever);

                if (!addTestCount) {
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
              Left is better
              <span className="sr-only">Vote Left</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vote Left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-fit px-2 h-10 gap-2 items-center"
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
              className="w-fit px-2 h-10 gap-2 items-center"
              onClick={async () => {
                if (hasVoted || !allRandom) return;

                if (hasVoted || !allRandom) return;
                const addTestCount = await addTimesTestedForBoth(retriever);

                if (!addTestCount) {
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
              Right is better
              <ArrowRightSquare className="h-4 w-4" />
              <span className="sr-only">Vote Right</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vote Right</TooltipContent>
        </Tooltip>
      </div>
      <div className="absolute right-0 flex items-center gap-2 pr-4">
        {/*<Tooltip open={hasVoted}>
          <TooltipTrigger asChild>
            <Button
              variant={!hasVoted ? "outline" : "default"}
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
            <Button variant="outline" size="icon" disabled={!message.length}>
              <Images className="h-4 w-4" />
              <span className="sr-only">Print Result</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print Result</TooltipContent>
        </Tooltip>
            */}
        {/* <Separator orientation="vertical" className="mx-1 h-6" /> */}
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
