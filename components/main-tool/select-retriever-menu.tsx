import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const arrayOfRetrievers = [
  "vector-store",
  "contextual-compression",
  "multi-query",
  "multi-vector",
  "parent-document",
  "self-query",
  "similarity-score",
  "time-weighted",
];

export function SelectRetrieverMenu({
  setRetrieverSelection,
  retrieverSelection,
}: {
  setRetrieverSelection: (value: string) => void;
  retrieverSelection: string;
}) {

  return (
    <div className="flex items-center p-2 self-center">
      <div className="flex items-center gap-2">
       
        <Select defaultValue="random" value={retrieverSelection} onValueChange={setRetrieverSelection}>
          <SelectTrigger className="md:w-[280px] w-full">
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
              <SelectItem value="similarity-score">Similarity Score</SelectItem>
              <SelectItem value="time-weighted">Time Weighted</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
