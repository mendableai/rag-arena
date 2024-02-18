
import { type Message } from "ai";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { SelectionMenu } from "./selection-menu";

export function MessageDisplay({ message }: { message: Message[] }) {

  return (
    <div className="flex h-full flex-col">
      <SelectionMenu message={message}/>
      <Separator />

      <div className="flex flex-1 flex-col">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage />
              <AvatarFallback>{"Leonardo"}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{"leonardo"}</div>
              <div className="line-clamp-1 text-xs">{"mail subject"}</div>
              <div className="line-clamp-1 text-xs">
                <span className="font-medium">Reply-To:</span> {"mail.email"}
              </div>
            </div>
          </div>

          <div className="ml-auto text-xs text-muted-foreground">{"date"}</div>
        </div>
        <Separator />
        <div className="flex-1 whitespace-pre-wrap p-4 text-sm max-h-[400px] overflow-y-scroll">
          {message.length > 0
            ? message.map((m) => (
                <div key={m.id} className="whitespace-pre-wrap">
                  {m.role === "user" ? "User: " : "AI: "}
                  {m.content}
                </div>
              ))
            : null}
        </div>
        <Separator className="mt-auto" />
      </div>
    </div>
  );
}
