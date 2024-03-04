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
import { Textarea } from "@/components/ui/textarea";
import aplyToast from "@/lib/aplyToaster";
import { useCustomDocumentStore } from "@/lib/zustand";
import { DocumentInterface } from "@langchain/core/documents";
import { Dot, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

async function createDocumentFromText(
  text: string,
  metadata: { parameter: string; value: string }[],
  chunkSize: number,
  chunkOverlap: number
) {
  const documentsWithMetadata = [];

  for (let i = 0; i < text.length; i += chunkSize - chunkOverlap) {
    const chunkText = text.substring(i, i + chunkSize);
    const documentMetadata = metadata.reduce(
      (acc: Record<string, string>, pair) => {
        acc[pair.parameter] = pair.value;
        return acc;
      },
      {}
    );
    const document: DocumentInterface<Record<string, any>> = {
      pageContent: chunkText,
      metadata: documentMetadata,
    };
    documentsWithMetadata.push(document);
  }

  return documentsWithMetadata;
}

export default function CustomIngest() {
  const [rawData, setRawData] = useState("");
  const [metadata, setMetadata] = useState([{ parameter: "", value: "" }]);

  const { customDocuments, setCustomDocuments } = useCustomDocumentStore();

  const [chunkSize, setChunkSize] = useState(50);
  const [chunkOverlap, setChunkOverlap] = useState(25);

  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (rawData.length > 3000) {
      aplyToast("Raw data is too long.");
      return;
    }
    createDocumentFromText(rawData, metadata, chunkSize, chunkOverlap).then(
      (res) => {
        setCustomDocuments(res as never[]);
      }
    );
  }, [metadata, rawData, chunkSize, chunkOverlap]);

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Dot
            className={`${
              customDocuments.length > 0 && "text-green-500 animate-pulse"
            } -ml-3`}
            size={40}
          />
          Ingest Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl justify-center">
        <DialogHeader>
          <DialogTitle>Ingest Data</DialogTitle>
          <DialogDescription>
            Use the retrievers with your own data. You can add metadata to
            documents and split them into chunks.
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
                  <form className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="width">Chunk Size:</Label>
                      <Input
                        id="width"
                        defaultValue={chunkSize.toString()}
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
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
              value={JSON.stringify(customDocuments, null, 2)}
              readOnly
              disabled
            ></Textarea>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
