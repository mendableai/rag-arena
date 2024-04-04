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
import {
  useInMemoryStore,
  useSelectedVectorStore,
  useSplitResultStore,
} from "@/lib/zustand";

const text_splitter_options = [
  {
    id: 1,
    title: "Pinecone",
  },
  {
    id: 2,
    title: "Supabase (postgres)",
  },
  {
    id: 3,
    title: "MongoDB (atlas)",
  },
];

export default function VectorStoreBox() {
  const { selectedVectorStore, setSelectedVectorStore } =
    useSelectedVectorStore();

  const { inMemory, setInMemory } = useInMemoryStore();

  const { splitResult } = useSplitResultStore();

  return (
    <Card className={`relative  border-none`}>
      <Badge
        variant={"outline"}
        className="-left-6 -top-4 absolute bg-primary text-black dark:text-white"
      >
        2
      </Badge>

      <div className="flex items-center space-x-2 absolute right-0">
        <Label htmlFor="in-memory" className="text-xs">
          In Memory:
        </Label>
        <Switch
          id="in-memory"
          checked={inMemory}
          onCheckedChange={(newInMemoryValue) => {
            if (splitResult.length !== 0) {
              setInMemory(newInMemoryValue);
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
            if (splitResult.length === 0) {
              setSelectedVectorStore(value);
            } else {
              aplyToast("Please clear the result first");
            }
          }}
          disabled={inMemory}
          value={selectedVectorStore}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a vector store" />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#080a0c]">
            <SelectGroup>
              <SelectLabel>Select a vector store</SelectLabel>
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
        {/* {splitResult.length === 0 ? ( */}
          <Button
            // variant={splitResult.length === 0 ? "default" : "outline"}
            variant={"default"}
            onClick={async () => {
              // setIsLoading(true);
              const result = await getVectorStores(
                splitResult,
                selectedVectorStore
              );
              // place input fields insertion to global variable here. (todo)
              // setIsLoading(false);
            }}
            disabled={selectedVectorStore === "" || inMemory}
          >
            Ingest
          </Button>
        {/* ) : (
          <Button
            variant={"link"}
            onClick={() => {
              setSelectedVectorStore("");
            }}
          >
            X
          </Button>
        )} */}

      </CardFooter>
    </Card>
  );
}
