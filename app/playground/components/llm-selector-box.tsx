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
import {
    useInMemoryStore,
    useSelectedPlaygroundLlmStore,
    useSplitResultStore
} from "@/lib/zustand";

const text_splitter_options = [
  {
    id: 1,
    title: "Openai",
  },
  {
    id: 2,
    title: "Mixtral",
  },
  {
    id: 3,
    title: "Cohere",
  },
];

export default function LlmSelectorBox() {
  const { selectedPlaygroundLlm, setSelectedPlaygroundLlm } =
    useSelectedPlaygroundLlmStore();

  const { inMemory, setInMemory } = useInMemoryStore();

  const { splitResult, setSplitResult } = useSplitResultStore();

  return (
    <Card className={`relative  border-none`}>
      <Badge
        variant={"outline"}
        className="-left-6 -top-4 absolute bg-primary text-black dark:text-white"
      >
        3
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
        {/* <Button
          // variant={splitResult.length === 0 ? "default" : "outline"}
          variant={"default"}
          onClick={async () => {
            // setIsLoading(true);
            const result = await getVectorStores(
              splitResult,
              selectedPlaygroundLlm
            );
            // place input fields insertion to global variable here. (todo)
            // setIsLoading(false);
          }}
          disabled={selectedPlaygroundLlm === "" || inMemory}
        >
          Select
        </Button> */}
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
