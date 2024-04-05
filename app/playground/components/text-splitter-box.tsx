"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  useCustomPlaygroundChunksStore,
  useSelectedSplitOptionStore,
} from "@/lib/zustand";
import { useState } from "react";
import CustomPlaygroundIngestion from "./custom-ingestion";
import { paulgrahamtext } from "./paulgrahamtext";



export default function TextSplitterBox() {
  const { selectedSplitOption, setSelectedSplitOption } =
    useSelectedSplitOptionStore();

  const { customPlaygroundChunks, setCustomPlaygroundChunks } =
    useCustomPlaygroundChunksStore();

  const [rawText, setRawText] = useState(paulgrahamtext);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className={`relative  border-none`}>
      <Badge
        variant={"outline"}
        className="-left-6 -top-4 absolute bg-primary text-white"
      >
        1
      </Badge>
      <CardHeader>Text Splitter</CardHeader>
      <CardContent className="flex gap-4">
        <CustomPlaygroundIngestion />

        
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
