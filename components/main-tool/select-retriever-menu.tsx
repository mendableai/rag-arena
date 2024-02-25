import { retrieverInfo } from "@/lib/constants";
import { useAllRandomStore, useInProcessStore } from "@/lib/zustand";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

export function SelectRetrieverMenu({
  setRetrieverSelection,
  retrieverSelection,
}: {
  setRetrieverSelection: (value: string) => void;
  retrieverSelection: string;
}) {
  const { allRandom } = useAllRandomStore();
  const { inProcess } = useInProcessStore();

  return (
    <>
      <div className="flex items-center p-2 self-center">
        <div className="flex items-center gap-2">
          <Select
            defaultValue="random"
            value={retrieverSelection}
            onValueChange={setRetrieverSelection}
          >
            <SelectTrigger
              className={`md:w-[280px] w-full ${
                allRandom && inProcess && "blur-sm"
              }`}
              disabled={allRandom && inProcess}
            >
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Retrievers:</SelectLabel>
                <SelectItem value="random">Random Retriever</SelectItem>
                <SelectItem value="vector-store">Vector Store</SelectItem>
                <SelectItem value="contextual-compression">
                  Contextual Compression
                </SelectItem>
                <SelectItem value="multi-query">Multi Query</SelectItem>
                <SelectItem value="multi-vector">Multi Vector</SelectItem>
                <SelectItem value="parent-document">Parent Document</SelectItem>
                <SelectItem value="self-query">Self Query</SelectItem>
                <SelectItem value="similarity-score">
                  Similarity Score
                </SelectItem>
                <SelectItem value="time-weighted">Time Weighted</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />

      <div className={`flex items-start p-4 ${allRandom && inProcess && "blur-sm"}`}>
        <div className="flex items-start gap-4 text-sm">
          <div className="grid gap-1">
            <div className="line-clamp-1 text-xs">
              {
                retrieverInfo[retrieverSelection as keyof typeof retrieverInfo]
                  ?.description
              }
            </div>
          </div>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {retrieverInfo[retrieverSelection as keyof typeof retrieverInfo]
            ?.link && (
            <Link
              href={
                retrieverInfo[retrieverSelection as keyof typeof retrieverInfo]
                  ?.link
              }
              target="_BLANK"
            >
              Learn more..
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
