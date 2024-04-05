"use client";

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
import { useSelectedPlaygroundRetrieverStore } from "@/lib/zustand";
import { retrieversForPlayground } from "../lib/constants";

export default function RetrieverSelectorBox() {
  const { selectedPlaygroundRetriever, setSelectedPlaygroundRetriever } =
    useSelectedPlaygroundRetrieverStore();

  return (
    <Card className={`relative  border-none`}>
      <Badge
        variant={"outline"}
        className="-left-6 -top-4 absolute bg-primary text-white"
      >
        3
      </Badge>

      <CardHeader>Retriever</CardHeader>
      <CardContent>
        <Select
          onValueChange={(value) => {
            setSelectedPlaygroundRetriever(value);
          }}
          value={selectedPlaygroundRetriever}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Retriever" />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#080a0c]">
            <SelectGroup>
              <SelectLabel>Select a Retriever</SelectLabel>
              {Object.entries(retrieversForPlayground).map(([id, option]) => (
                <SelectItem key={id} value={id}>
                  {option.fullName}
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
