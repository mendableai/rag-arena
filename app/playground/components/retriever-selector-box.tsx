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
import { useEffect, useState } from "react";
import { getRetrieverCode } from "../code-templates/retriever-code-sample";
import { retrieversForPlayground } from "../lib/constants";
import { useSelectedPlaygroundRetrieverStore } from "../lib/globals";
import { BlockChunk } from "./animate-blocks.tsx";

export default function RetrieverSelectorBox() {
  const { selectedPlaygroundRetriever, setSelectedPlaygroundRetriever } =
    useSelectedPlaygroundRetrieverStore();

  const [language, setLanguage] = useState("python");
  const [languageDemo, setLanguageDemo] = useState("");

  useEffect(() => {
    async function fetchInitialCode() {
      const initialCode = await getRetrieverCode(
        "vector_store",
        "python",
        ""
      );
      setLanguageDemo(initialCode);
    }
    fetchInitialCode();
  }, []);

  const blockInfo = {
    name: "Retriever",
    code: languageDemo,
  };

  return (
    <BlockChunk
      info={blockInfo}
      codeExample={{ languageDemo, language }}
      setLanguage={setLanguage}
      setLanguageDemo={setLanguageDemo}
      disabled={selectedPlaygroundRetriever === ""}
    >
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
    </BlockChunk>
  );
}
