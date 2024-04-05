"use client";

import { VALID_MODELS } from "@/app/api/chat/utilities/variables";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedPlaygroundLlmStore } from "@/lib/zustand";

export default function LlmSelectorBox() {
  const { selectedPlaygroundLlm, setSelectedPlaygroundLlm } =
    useSelectedPlaygroundLlmStore();

  return (
    <Card className={`relative  border-none`}>
      <Badge
        variant={"outline"}
        className="-left-6 -top-4 absolute bg-primary text-white"
      >
        4
      </Badge>

      <CardHeader>LLM</CardHeader>
      <CardContent>
        <Select
          onValueChange={(value) => {
            setSelectedPlaygroundLlm(value);
          }}
          value={selectedPlaygroundLlm}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a LLM" />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#080a0c]">
            <SelectGroup>
              <SelectLabel>Select a LLM</SelectLabel>
              {Object.entries(VALID_MODELS).map(([id, option]) => (
                <SelectItem key={id} value={id}>
                  {option.modelName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
