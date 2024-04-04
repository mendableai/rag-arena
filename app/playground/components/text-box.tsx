"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRawTextStore } from "@/lib/zustand";

export default function TextBox() {

  const { rawText, setRawText } = useRawTextStore();

  return (
    <Card className="relative">
      <CardHeader>Raw Text</CardHeader>
      <CardContent>
        <Textarea
          className="h-[200px]"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
