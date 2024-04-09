/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import aplyToast from "@/lib/aplyToaster";
import { Dot, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { text_splitter_options } from "../../lib/constants";
import {
  useCustomPlaygroundChunksStore,
  useSelectedSplitOptionStore,
} from "../../lib/globals";
import { paulgrahamtext } from "../../lib/paulgrahamtext";
import { createDocumentFromText } from "../utils/text-splitter-functions";

export default function CustomPlaygroundIngestion() {
  const [rawData, setRawData] = useState(paulgrahamtext);
  const [metadata, setMetadata] = useState([
    { parameter: "author", value: "Paul Graham" },
  ]);

  const [chunkSize, setChunkSize] = useState(50);
  const [chunkOverlap, setChunkOverlap] = useState(25);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const { customPlaygroundChunks, setCustomPlaygroundChunks } =
    useCustomPlaygroundChunksStore();

  const { selectedSplitOption, setSelectedSplitOption } =
    useSelectedSplitOptionStore();

  const handleAddPair = () => {
    if (metadata.length < 5) {
      setMetadata([...metadata, { parameter: "", value: "" }]);
    } else {
      alert("You can only add up to 5 metadata.");
    }
  };

  const handleChange = (
    index: number,
    key: "parameter" | "value",
    value: string
  ) => {
    const newMetadata = [...metadata];
    if (key === "parameter") {
      newMetadata[index].parameter = value;
    } else if (key === "value") {
      newMetadata[index].value = value;
    }
    setMetadata(newMetadata);
  };

  const handleRemovePair = (index: number) => {
    const newMetadata = [...metadata];
    newMetadata.splice(index, 1);
    setMetadata(newMetadata);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full hover:scale-105">
          <Dot
            className={`${
              customPlaygroundChunks.length > 0 && "text-primary animate-pulse"
            } -ml-3`}
            size={40}
          />
          <span className="hidden sm:inline">Create Documents</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl justify-center">
        <DialogHeader>
          <DialogTitle>Create Documents</DialogTitle>
          <DialogDescription>
            Add your custom text and metadata to create documents which will be
            then ingested into the vector store.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 md:min-w-[800px] md:min-h-[400px]">
          <div className="flex flex-col w-full h-full gap-2 ">
            <div className="flex flex-col gap-2 w-full h-full">
              <Label htmlFor="name" className="text-left">
                Raw Data
              </Label>
              <Textarea
                className="w-full h-full"
                onChange={(e) => setRawData(e.target.value)}
                value={rawData}
              ></Textarea>
            </div>

            <div className="flex flex-col gap-2 max-h-[400px] min-h-[200px] overflow-auto px-4">
              {metadata.map((pair, index) => (
                <div key={index} className="flex gap-2">
                  <div>
                    <Label htmlFor={`parameter-${index}`} className="text-left">
                      Parameter
                    </Label>
                    <Input
                      value={pair.parameter}
                      onChange={(e) =>
                        handleChange(index, "parameter", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`value-${index}`} className="text-left">
                      Value
                    </Label>
                    <Input
                      value={pair.value}
                      onChange={(e) =>
                        handleChange(index, "value", e.target.value)
                      }
                    />
                  </div>
                  {metadata.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePair(index)}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
              {metadata.length < 5 && (
                <button type="button" onClick={handleAddPair}>
                  + Add Metadata
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="absolute mt-8 right-14 z-50"
                >
                  Chunk Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 dark:bg-secondary">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Chunk Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Read more about text chunking{" "}
                      <Link
                        href="https://js.langchain.com/docs/modules/data_connection/document_transformers/character_text_splitter"
                        target="_blank"
                        className="font-extrabold text-primary"
                      >
                        here
                      </Link>
                    </p>
                  </div>
                  <form className="flex flex-col gap-4">
                    <Label htmlFor="maxWidth">Splitter:</Label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedSplitOption(value);
                        setCustomPlaygroundChunks([]);
                      }}
                      value={selectedSplitOption.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a splitter" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#080a0c]">
                        <SelectGroup>
                          <SelectLabel>Split by</SelectLabel>
                          {text_splitter_options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <div className="flex flex-col gap-3">
                      <Label htmlFor="width">Chunk Size:</Label>
                      <Input
                        id="width"
                        defaultValue={chunkSize.toString()}
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="maxWidth">Chunk Overlap:</Label>
                      <Input
                        id="maxWidth"
                        defaultValue={chunkOverlap.toString()}
                        className="col-span-2 h-8"
                      />
                    </div>

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        const widthElement = document.getElementById(
                          "width"
                        ) as HTMLInputElement;
                        const maxWidthElement = document.getElementById(
                          "maxWidth"
                        ) as HTMLInputElement;

                        if (Number(widthElement.value) < 50) {
                          aplyToast("Chunk size cannot be lower than 50.");
                          return;
                        }

                        if (Number(maxWidthElement.value) < 0) {
                          aplyToast("Chunk overlap cannot be lower than 0.");
                          return;
                        }

                        const newChunkSize = Number(widthElement.value);
                        const newChunkOverlap = Number(maxWidthElement.value);
                        setChunkSize(newChunkSize);
                        setChunkOverlap(newChunkOverlap);

                        setPopoverOpen(false);
                      }}
                    >
                      Set Values
                    </Button>
                  </form>
                </div>
              </PopoverContent>
            </Popover>
            <Label htmlFor="username" className="text-left">
              Documents
            </Label>
            <Textarea
              className="w-full h-full"
              value={JSON.stringify(customPlaygroundChunks, null, 2)}
              readOnly
              disabled
            ></Textarea>
          </div>
        </div>
        <DialogFooter className="flex">
          <Button
            variant="outline"
            onClick={() => {
              if (rawData.length > 32000) {
                aplyToast("Raw data is too long.");
                return;
              }
              createDocumentFromText(
                rawData,
                metadata,
                chunkSize,
                chunkOverlap,
                selectedSplitOption
              ).then((res) => {
                setCustomPlaygroundChunks(res as never[]);
              });
            }}
          >
            Generate
          </Button>

          <Button
            className=" text-white"
            type="submit"
            onClick={() => setDialogOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
