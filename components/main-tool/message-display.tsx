import { type Message } from "ai";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function MessageDisplay({ message }: { message: Message[] }) {
  return (
    <div className="flex h-full flex-col">
      <Separator />

      <div className="flex flex-1 flex-col">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage />
              <AvatarFallback>LM</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">Retriever Name</div>
              <div className="line-clamp-1 text-xs">Retriever description</div>
            </div>
          </div>

          <div className="ml-auto text-xs text-muted-foreground">
            Learn more..
          </div>
        </div>
        <Separator />
        <div className="flex-1 whitespace-pre-wrap p-4 text-sm max-h-[400px] overflow-y-scroll gap-6 flex flex-col">
          {message.length > 0
            ? message.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${
                    m.role === "user" ? "justify-end" : "justify-between"
                  }`}
                >
                  <div
                    className={`whitespace-pre-wrap max-w-96 min-w-40 ${
                      m.role !== "user" ? "text-left" : "text-right"
                    }`}
                  >
                    <strong>{m.role === "user" ? "" : "AI: "}</strong>
                    {m.content}
                  </div>
                  <div className="text-xs text-muted-foreground min-w-20 text-right">
                    {m?.createdAt?.toLocaleTimeString()}
                  </div>
                </div>
              ))
            : null}
        </div>
        <Separator className="mt-auto" />
      </div>
    </div>
  );
}
