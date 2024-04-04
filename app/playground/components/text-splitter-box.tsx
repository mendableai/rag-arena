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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import aplyToast from "@/lib/aplyToaster";
import {
  useRawTextStore,
  useSelectedSplitOptionStore,
  useSplitResultStore,
} from "@/lib/zustand";
import { useEffect, useState } from "react";

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

  const { splitResult, setSplitResult } = useSplitResultStore();

  const { rawText } = useRawTextStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(splitResult);
  }, [splitResult]);

  return (
    <Card className={`relative  border-none`}>
      <Badge
        variant={"outline"}
        className="-left-6 -top-4 absolute bg-primary text-black dark:text-white"
      >
        1
      </Badge>
      <CardHeader>Text Splitter</CardHeader>
      <CardContent>
        <Select
          onValueChange={(value) => {
            if (splitResult.length === 0) {
              setSelectedSplitOption(Number(value));
            } else {
              aplyToast("Please clear the result first");
            }
          }}
          value={selectedSplitOption.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a splitter" />
          </SelectTrigger>
          <SelectContent className="bg-[#080a0c]">
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
      <CardFooter className="flex justify-between">
        {splitResult.length === 0 ? (
          <Button
            variant={splitResult.length === 0 ? "default" : "outline"}
            onClick={async () => {
              setIsLoading(true);
              const result = await splitText(rawText, selectedSplitOption);
              setSplitResult(result.data);
              setIsLoading(false);
            }}
            disabled={selectedSplitOption === 0}
          >
            Split
          </Button>
        ) : (
          <Button
            variant={"link"}
            onClick={() => {
              setSplitResult([]);
              setSelectedSplitOption(0);
            }}
          >
            X
          </Button>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={splitResult.length === 0 ? "ghost" : "outline"}
              disabled={splitResult.length === 0}
            >
              Result
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Chunked Text</DialogTitle>
              <DialogDescription>
                Chunks created {splitResult.length}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-72 rounded-md border">
              <div className="grid gap-4 py-4">
                {splitResult.map((item, index) => (
                  <div className="mb-4 mx-2" key={index}>
                    {item}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
