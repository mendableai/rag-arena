"use client";

import { useChat } from 'ai/react';
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
import { MessageDisplay } from './message-display';
import { SelectionMenu } from './selection-menu';

export function ChatBots() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50}>
              <MessageDisplay message={messages} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <MessageDisplay message={messages} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>

        <SelectionMenu message={messages}/>
          <div className="p-4 max-w-3xl m-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <Textarea className="p-4" placeholder={`Reply...`} value={input} onChange={handleInputChange} />
                <div className="flex items-center">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> Mute this
                    thread
                  </Label>
                  <Button
                    
                    size="sm"
                    className="ml-auto"
                  >
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
