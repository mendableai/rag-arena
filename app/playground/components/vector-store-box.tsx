"use client";

import { getVectorStores } from "@/app/actions/playground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import aplyToast from "@/lib/aplyToaster";
import { useEffect, useState } from "react";
import { getVectorStoreCode } from "../code-templates/vector-store-code-sample";
import { PLAYGROUND_VECTOR_STORES } from "../lib/constants";
import {
  useCustomPlaygroundChunksStore,
  useSelectedVectorStore,
} from "../lib/globals";
import { BlockChunk } from "./animate-blocks.tsx";

export default function VectorStoreBox() {
  const { selectedVectorStore, setSelectedVectorStore } =
    useSelectedVectorStore();

  const { customPlaygroundChunks } = useCustomPlaygroundChunksStore();

  const [language, setLanguage] = useState("python");
  const [languageDemo, setLanguageDemo] = useState("");

  useEffect(() => {
    async function fetchInitialCode() {
      const initialCode = await getVectorStoreCode("supabase", "python", "");
      setLanguageDemo(initialCode);
    }
    fetchInitialCode();
  }, []);

  const mockBlockChunk = {
    name: "Vector Store",
    code: languageDemo,
  };

  return (
    <BlockChunk
      chunk={mockBlockChunk}
      codeExample={{ languageDemo, language }}
      setLanguage={setLanguage}
      setLanguageDemo={setLanguageDemo}
    >
      <Card className={`relative border-none`}>
        <Badge
          variant={"outline"}
          className="-left-6 -top-4 absolute bg-primary text-white"
        >
          2
        </Badge>

        <div className="flex items-center space-x-2 absolute right-0">
          <Label htmlFor="in-memory" className="text-xs">
            In Memory:
          </Label>
          <Switch
            id="in-memory"
            checked={selectedVectorStore === "in_memory"}
            onCheckedChange={(value) => {
              if (customPlaygroundChunks.length !== 0) {
                setSelectedVectorStore(value ? "in_memory" : "");
              } else {
                aplyToast("Please use the text splitter first");
              }
            }}
          />
        </div>

        <CardHeader>Vector Store</CardHeader>
        <CardContent>
          <Select
            onValueChange={(value) => {
              setSelectedVectorStore(value);
            }}
            disabled={selectedVectorStore === "in_memory"}
            value={selectedVectorStore}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a vector store" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#080a0c]">
              <SelectGroup>
                <SelectLabel>Select a vector store</SelectLabel>
                {PLAYGROUND_VECTOR_STORES.map((option, index) => (
                  <SelectItem key={index} value={option.value}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant={"default"}
            onClick={async () => {
              // setIsLoading(true);
              const result = await getVectorStores(
                customPlaygroundChunks,
                selectedVectorStore
              );
              // place input fields insertion to global variable here. (todo)
              // setIsLoading(false);
            }}
            disabled={selectedVectorStore !== ""}
          >
            Ingest
          </Button>
        </CardFooter>
      </Card>
    </BlockChunk>
  );
}
