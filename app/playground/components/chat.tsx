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
import { CornerDownLeftIcon } from "lucide-react";

export default function PlaygroundChat() {
  return (
    <Card className="h-[500px] flex flex-col">
      <CardContent className="flex-1"></CardContent>
      <CardFooter className="self-end w-full">
        <div className="p-4 w-full m-auto">
          <form
            // onSubmit={handleFormSubmit}
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring lg:col-span-3 max-w-[800px] max-h-[140px]"
          >
            <Label className="sr-only" htmlFor="message">
              Message
            </Label>
            <Textarea
              className="min-h-20 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              placeholder={"Ask a question about your custom data"}
              // value={input}
              // onChange={(e) => setInput(e.target.value)}
              // onKeyDown={handleKeyDown}
              // disabled={hasVoted}
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
                  // disabled={hasVoted}
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
