"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const text_splitter_options = [
    {
        id: "1",
        title: "Split by character",
    },
    {
        id: "2",
        title: "Split by word",
    },
]

export default function ChatSplitterBox() {
  const [selectedSplitOption, setSelectedSplitOption] = useState("");

  return (
    <Card>
      <CardHeader>Text Splitter</CardHeader>
      <CardContent>
        <Select onValueChange={setSelectedSplitOption} value={selectedSplitOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a splitter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Split by</SelectLabel>
              {text_splitter_options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>
                <Button>Split</Button>
      </CardFooter>
    </Card>
  );
}
