import { retrieverInfo } from "@/lib/constants";
import {
  useAllRandomStore,
  useChatSessionsStore,
  useInProcessStore,
} from "@/lib/zustand";
import Link from "next/link";
import PuffLoader from "react-spinners/PuffLoader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function SelectRetrieverMenu({
  setRetrieverSelection,
  retrieverSelection,
}: {
  setRetrieverSelection: (value: string) => void;
  retrieverSelection: string;
}) {
  const { allRandom } = useAllRandomStore();
  const { inProcess } = useInProcessStore();

  const { chatSessions } = useChatSessionsStore();
  const getLoadingStateForCurrentSelection = () => {
    const session = chatSessions.find(
      (session) => session.retrieverSelection === retrieverSelection
    );
    return session ? session.loading : false;
  };

  const isLoading = getLoadingStateForCurrentSelection();

  return (
    <div className="flex items-center p-2 self-center fixed gap-4">
      <PuffLoader
        color="#df8191"
        loading={isLoading}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="-mt-4"
        style={{ position: "absolute" }}
      />
      <div className="flex items-center gap-2">
        <Select
          defaultValue="random"
          value={retrieverSelection}
          onValueChange={setRetrieverSelection}
        >
          <SelectTrigger
            className={`md:w-[280px] w-full ${allRandom && inProcess && "blur-xl"}`}
            disabled={allRandom && inProcess}
          >
            <SelectValue
              placeholder="Select a retriever"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Retrievers:</SelectLabel>
              <SelectItem value="random">Random Retriever</SelectItem>
              <SelectItem value="vector-store">Vector Store 🦜🔗</SelectItem>
              <SelectItem value="contextual-compression">
                Contextual Compression 🦜🔗
              </SelectItem>
              <SelectItem value="multi-query">Multi Query 🦜🔗</SelectItem>
              {/* <SelectItem value="multi-vector">Multi Vector 🦜🔗</SelectItem> */}
              <SelectItem value="parent-document">
                Parent Document 🦜🔗
              </SelectItem>
              {/* <SelectItem value="self-query">Self Query 🦜🔗</SelectItem> */}
              <SelectItem value="similarity-score">
                Similarity Score 🦜🔗
              </SelectItem>
              <SelectItem value="graph-rag-li">Graph RAG 🦙</SelectItem>
              <SelectItem value="bm-25-li">BM 25 🦙</SelectItem>
              <SelectItem value="vector-store-li">
                llama Vector Store 🦙
              </SelectItem>
              <SelectItem value="reciprocal-rerank-fusion-li">
                Reciprocal Rerank Fusion 🦙
              </SelectItem>
              <SelectItem value="auto-merging-retriever-li">
                Auto Merging Retriever 🦙
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        className={`ml-auto text-xs text-muted-foreground ${
          allRandom && inProcess && "hidden"
        }`}
      >
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
  );
}
