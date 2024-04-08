"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useChosenModelStore } from "@/lib/zustand";
// deploy
const frameworks = [
  {
    value: "mistral",
    label: "Mixtral-8x7b-Instruct-v0.1",
  },
  {
    value: "gpt-3.5-turbo",
    label: "Gpt-3.5-turbo-1106",
  },
  {
    value: "command-r",
    label: "Cohere-command-r",
  },
];
//  tst
export default function LlmSelector() {
  const [open, setOpen] = React.useState(false);

  const { chosenModel, setChosenModel } = useChosenModelStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
        >
          {chosenModel
            ? frameworks.find(
                (framework) =>
                  framework.value.toLowerCase() === chosenModel.toLowerCase()
              )?.label || "Failed to find framework label"
            : "Select framework..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search model..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue: string) => {
                  setChosenModel(currentValue);
                  setOpen(false);
                }}
              >
                {framework.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    chosenModel === framework.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
