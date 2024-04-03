"use client";

import { splitText } from "@/app/actions/playground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useRawTextStore, useSelectedSplitOptionStore } from "@/lib/zustand";

const text_splitter_options = [
  {
    id: 1,
    title: "Split by character",
  },
  {
    id: 2,
    title: "Recursive Character Text Splitter",
  },
  {
    id: 3,
    title: "Semantic Chunking",
  },
];

export default function TextSplitterBox() {
  const { selectedSplitOption, setSelectedSplitOption } =
    useSelectedSplitOptionStore();

  const { rawText } = useRawTextStore();

  return (
    <Card className="relative">
      <Badge
        variant={"outline"}
        className="-left-2 -top-2 absolute bg-white text-black dark:bg-black dark:text-white"
      >
        2
      </Badge>
      <CardHeader>Text Splitter</CardHeader>
      <CardContent>
        <Select
          onValueChange={(value) => setSelectedSplitOption(Number(value))}
          value={selectedSplitOption.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a splitter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Split by</SelectLabel>
              {text_splitter_options.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>
        <Button
          onClick={async () => {
            const result = await splitText(rawText, selectedSplitOption);
            console.log(result);
          }}
        >
          Split
        </Button>
      </CardFooter>
    </Card>
  );
}
